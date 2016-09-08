import createValidator from '../../src/utils/validator';

const rules = [
  { fields: ['name', 'password'], validator: 'require' },
];
const data = {
  name: 'user',
  password: '',
};

describe('Validator', () => {
  it('Should import a function', () => {
    expect(createValidator).to.be.an('function');
  });

  describe('::createValidator', () => {
    it('Should return a function when method is called', () => {
      expect(createValidator(rules)).to.be.an('function');
    });
  });
});
