/* eslint-disable no-debugger, no-console */
import { Flowable, Single } from 'rsocket-flowable';
import {
  encodeCompositeMetadata,
  encodeRoute,
  MESSAGE_RSOCKET_ROUTING,
} from 'rsocket-core';

const MAX_REQUEST_N = 2147483647;

class RSocketReconnectableClient {
  /**
   * @param clientFactory Function Create RSocket client
   * @param options Object
   * @param options.debug Boolean - Show debug messages
   * @param options.interval Number - Reconnect interval if connection closed
   * @param options.getToken Function - Get token function
   * @param options.onRefreshToken Function - Refresh token function if token expired
   */
  constructor(clientFactory, options) {
    this._clientFactory = clientFactory;
    this._debug = options.debug || false;
    this._interval = options.interval || 1000;
    this._getToken = options.getToken || (() => undefined);
    this._onRefreshToken = options.onRefreshToken || (() => undefined);

    this._socket = null;
    this._timerID = null;
    this._done = false;

    this._route = null;

    this.connect();
  }

  async connect() {
    try {
      this._socket = await this._clientFactory().connect();

      let subscription = null;
      this._socket.connectionStatus()
        .subscribe({
          onNext: (event) => {
            // If someone closed connection manually --> just cancel subscription
            if (this._done) {
              subscription.close();

              return;
            }

            // Clear timer id if exist for connected status
            if (event.kind === 'CONNECTED') {
              this._timerID = null;

              return;
            }

            // Try to reconnect if something went happened with connection in process
            if (event.kind !== 'CONNECTED') {
              this._socket = null;
              this._timerID = setTimeout(() => this.connect(), this._interval);
            }
          },
          onSubscribe: (_subscription) => {
            subscription = _subscription;

            subscription.request(MAX_REQUEST_N);
          },
        });
    } catch (e) {
      // Retry to connect if something wrong with connect on start
      this._timerID = setTimeout(() => this.connect(), this._interval);
    }
  }

  /**
   * Close connection
   */
  close() {
    this._done = true;
    clearTimeout(this._timerID);

    if (!this._socket) {
      return;
    }

    this._socket.close();
    this._socket = null;
  }

  fireAndForget(payload) {
    if (!this._socket) {
      throw new Error('Not Connected yet. Retry later');
    }

    this._socket.fireAndForget(payload);
  }

  requestResponse(payload) {
    if (!this._socket) {
      return Single.error(new Error('Not Connected yet. Retry later'));
    }

    return this._socket.requestResponse(payload);
  }

  requestStream(payload) {
    return new Flowable((subscriber) => {
      const route = this._route;
      this._route = null;
      this._auth = null;
      let cancelled = false;

      const request = (_n) => {
        const n = Math.min(_n, MAX_REQUEST_N);

        if (this._debug) {
          console.log('RSocket: Try to subscribe', n);
        }

        // Skip any actions if connection was closed or subscription cancelled
        if (this._done || cancelled) {
          return;
        }

        // Try to resubscribe if socket not ready yet
        if (!this._socket) {
          setTimeout(() => request(n), 1000);

          return;
        }

        if (this._debug) {
          console.log('RSocket: Requesting stream', { route, data: payload.data, metadata: payload.metadata });
        }

        let subscription = null;
        this._socket.requestStream({
          data: this._constructData(payload.data),
          metadata: this._constructMetadata(payload.metadata, route),
        }).subscribe({
          onNext: (value) => {
            // Cancel subscription if someone canceled the stream
            if (cancelled) {
              if (this._debug) {
                console.log('RSocket: Cancel subscription', { route, data: payload.data, metadata: payload.metadata });
              }

              subscription.cancel();

              return;
            }

            let data = null;
            let metadata = null;

            try {
              data = JSON.parse(value?.data?.toString());
              metadata = JSON.parse(value?.metadata?.toString());
            } catch (e) {
              // Do nothing...
            }

            if (this._debug) {
              console.log('RSocket: On next', { data, metadata });
            }

            subscriber.onNext({ data, metadata });
          },
          onError: async (e) => {
            // If error thrown and stream wasn't closed manually -> cancel subscription and try to resubscribe
            if (!this._done) {
              if (this._debug) {
                console.log('RSocket: Error in process. Resubscribing...', e, e.source);
              }

              subscription.cancel();

              // Try to refresh token if token expired
              if (e?.source?.message === 'TOKEN_EXPIRED') {
                if (this._debug) {
                  console.log('RSocket: Start token refreshing, because of error "Access Denied" was thrown...');
                }

                await this._onRefreshToken();
              }

              setTimeout(() => request(n), 1000);
            }
          },
          onSubscribe: (_subscription) => {
            subscription = _subscription;
            subscription.request(n);
          },
        });
      };

      subscriber.onSubscribe({
        cancel: () => { cancelled = true; },
        request,
      });
    });
  }

  requestChannel(payloads) {
    if (!this._socket) {
      return Flowable.error(new Error('Not Connected yet. Retry later'));
    }

    return this._socket.requestChannel(payloads);
  }

  metadataPush(payload) {
    if (!this._socket) {
      return Single.error(new Error('Not Connected yet. Retry later'));
    }

    return this._socket.metadataPush(payload);
  }

  /**
   * Define route in metadata for responder
   *
   * @param route
   *
   * @return {RSocketResponder}
   */
  route(route) {
    this._route = route;

    return this;
  }

  /**
   * Construct metadata depends on routing, auth, custom metadata
   *
   * @param metadata
   * @param route
   *
   * @return {[*, Uint8Array][]}
   *
   * @private
   */
  _constructMetadata = (metadata = [], route) => {
    const _metadata = Object.keys(metadata).map(key => [key, Buffer.from(metadata[key])]);

    // Encode route metadata if it exist
    if (route) {
      _metadata.push([MESSAGE_RSOCKET_ROUTING, encodeRoute(route)]);
    }

    // Encode auth metadata if it exist
    const token = this._getToken();

    if (token) {
      _metadata.push(['message/x.rsocket.authentication.bearer.v0', Buffer.from(token)]);
    }

    return _metadata.length ? encodeCompositeMetadata(_metadata) : undefined;
  };

  /**
   * Construct data
   *
   * @param data
   * @return {Buffer}
   *
   * @private
   */
  _constructData = data => Buffer.from(typeof data === 'object' ? JSON.stringify(data) : data);
}

export default RSocketReconnectableClient;
