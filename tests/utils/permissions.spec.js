import Permissions, { CONDITIONS } from 'utils/permissions';

let permissionInstance;
const permission = {
  AREA_ONE: {
    STAGE_A: 'area.1.stage.a',
    STAGE_B: 'area.1.stage.b',
  },
  AREA_TWO: {
    STAGE_A: 'area.2.stage.a',
    STAGE_B: 'area.2.stage.b',
  },
};
describe('utils/permissions', () => {
  describe('Permissions class', () => {
    beforeEach(() => {
      permissionInstance = new Permissions([]);
    });

    it('should create instance of Permissions', () => {
      expect(permissionInstance).to.be.an.instanceof(Permissions);
    });

    it('should have "and" method in instance', () => {
      expect(permissionInstance).to.respondTo('and');
    });

    it('should have "or" method in instance', () => {
      expect(permissionInstance).to.respondTo('or');
    });

    it('should contain previous and new permissions with condition as first', () => {

    });

    it('should grant access', () => {

    });
  });

  describe('Conditions object', () => {
    it('should be an object', () => {
      expect(CONDITIONS).to.be.an('object');
    });
  });
});
