import Permissions, { CONDITIONS } from '../../src/utils/permissions';

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

    it('should have "check" method in instance', () => {
      expect(permissionInstance).to.respondTo('check');
    });

    it('should throw error when pass invalid param to "check" method', () => {
      expect(permissionInstance.check.bind(null, null)).to.throw(Error);
      expect(permissionInstance.check.bind(null, 0)).to.throw(Error);
      expect(permissionInstance.check.bind(null, 'test')).to.throw(Error);
      expect(permissionInstance.check.bind(null, {})).to.throw(Error);
    });

    it('should contain previous and new permissions with condition as first', () => {
      const resultPermission = [
        CONDITIONS.OR,
        [
          [CONDITIONS.OR, [
            [CONDITIONS.AND, [
              permission.AREA_ONE.STAGE_A, permission.AREA_ONE.STAGE_B,
            ]],
            permission.AREA_TWO.STAGE_B,
          ]],
          permission.AREA_TWO.STAGE_A,
        ],
      ];
      const compiledPermissions = permissionInstance
        .and([permission.AREA_ONE.STAGE_A, permission.AREA_ONE.STAGE_B])
        .or(permission.AREA_TWO.STAGE_B)
        .or(permission.AREA_TWO.STAGE_A)
        .getCompiled();

      expect(compiledPermissions).to.deep.equal(resultPermission);
    });

    it('should grant access by "OR" condition', () => {
      expect(
        permissionInstance
          .and([permission.AREA_TWO.STAGE_A, permission.AREA_ONE.STAGE_B])
          .or(permission.AREA_ONE.STAGE_A)
          .check([permission.AREA_ONE.STAGE_A])
      ).to.equal(true);
      expect(
        permissionInstance
          .and([
            permission.AREA_ONE.STAGE_A,
            permission.AREA_TWO.STAGE_A,
            permission.AREA_ONE.STAGE_B,
          ])
          .or([
            permission.AREA_ONE.STAGE_A,
            permission.AREA_ONE.STAGE_B,
            permission.AREA_TWO.STAGE_A,
          ])
          .or([
            permission.AREA_ONE.STAGE_A,
            permission.AREA_ONE.STAGE_B,
            permission.AREA_TWO.STAGE_B,
          ])
          .check([
            permission.AREA_ONE.STAGE_A,
            permission.AREA_ONE.STAGE_B,
            permission.AREA_TWO.STAGE_B,
          ])
      ).to.equal(true);
    });

    it('should grant access by "AND" condition', () => {
      expect(
        permissionInstance
          .and([permission.AREA_TWO.STAGE_A, permission.AREA_ONE.STAGE_B])
          .check([permission.AREA_TWO.STAGE_A, permission.AREA_ONE.STAGE_B])
      ).to.equal(true);
      expect(
        permissionInstance
          .and([
            permission.AREA_ONE.STAGE_A,
            permission.AREA_TWO.STAGE_A,
            permission.AREA_ONE.STAGE_B,
          ])
          .check([
            permission.AREA_ONE.STAGE_A,
            permission.AREA_ONE.STAGE_B,
            permission.AREA_TWO.STAGE_A,
          ])
      ).to.equal(true);
    });

    it('should restrict access', () => {
      expect(
        permissionInstance
          .and([permission.AREA_TWO.STAGE_A, permission.AREA_ONE.STAGE_B])
          .or(permission.AREA_ONE.STAGE_A)
          .check([permission.AREA_ONE.STAGE_B])
      ).to.equal(false);
      expect(
        permissionInstance
          .and([permission.AREA_TWO.STAGE_A, permission.AREA_ONE.STAGE_B])
          .or(permission.AREA_ONE.STAGE_A)
          .check([permission.AREA_TWO.STAGE_B])
      ).to.equal(false);
      expect(
        permissionInstance
          .and([permission.AREA_TWO.STAGE_A, permission.AREA_ONE.STAGE_B])
          .or(permission.AREA_ONE.STAGE_A)
          .check()
      ).to.equal(false);
    });
  });

  describe('Conditions object', () => {
    it('should be an object', () => {
      expect(CONDITIONS).to.be.an('object');
    });
  });
});
