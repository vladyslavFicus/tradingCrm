import { shortify } from '../../src/utils/uuid';

describe('utils/uuid', () => {
  describe('uuid util', () => {
    it('valid shortify uuid', () => {
      expect(shortify('PLAYER-3fd80a6e-931d-43b4-9f71-e639b9ea8045')).to.equal('PL-3fd80a6e');
      expect(shortify('3fd80a6e-931d-43b4-9f71-e639b9ea8045')).to.equal('3fd80a6e');
      expect(shortify('PLAYER-3fd80a6e-931d-43b4-9f71-e639b9ea8045', null, 3)).to.equal('PL-3fd80a6e-931d');
      expect(shortify('3fd80a6e-931d-43b4-9f71-e639b9ea8045', 'TT')).to.equal('TT-3fd80a6e');
      expect(shortify('PLAYER-3fd80a6e-931d-43b4-9f71-e639b9ea8045', 'TT')).to.equal('TT-3fd80a6e');
      expect(shortify('CAMPAIGN-3fd80a6e-931d-43b4-9f71-e639b9ea8045', 'CA')).to.equal('CA-3fd80a6e');
      expect(shortify('CAMPAIGN-3fd80a6e-931d-43b4-9f71-e639b9ea8045', 'MANUAL', 4)).to.equal('MANUAL-3fd80a6e-931d-43b4');
      expect(shortify('CAMPAIGN-3fd80a6e-931d-43b4-9f71-e639b9ea8045', null, 999)).to.equal('CA-3fd80a6e-931d-43b4-9f71-e639b9ea8045');
      expect(shortify('CAMPAIGN-3fd80a6e-931d-43b4-9f71-e639b9ea8045', '123', 999)).to.equal('123-3fd80a6e-931d-43b4-9f71-e639b9ea8045');
      expect(shortify('e639b9ea8045')).to.equal('e639b9ea8045');
      expect(shortify('e639b9ea8045', 'PL')).to.equal('PL-e639b9ea8045');
      expect(shortify('e639b9ea8045', 'PL', 4)).to.equal('PL-e639b9ea8045');
      expect(shortify('e639b9ea8045', 'PL', 0)).to.equal('PL-e639b9ea8045');
      expect(shortify('e639b9ea8045', 'PL', 1)).to.equal('PL-e639b9ea8045');
      expect(shortify('PLAYER-e639b9ea8045', 'TT')).to.equal('TT-e639b9ea8045');
    });
  });
});
