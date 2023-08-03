type Props = {
  uuid: string,
  length?: number,
};

const useUuid = (props: Props) => {
  const {
    uuid: inputUUID,
    length,
  } = props;

  const uuid = inputUUID.substring(0, length);

  return { uuid };
};

export default useUuid;
