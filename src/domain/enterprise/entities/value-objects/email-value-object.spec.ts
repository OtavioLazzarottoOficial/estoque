import { EmailValueObject } from './email-value-object';

describe('Teste', () => {
  it('Testando', () => {
    const result = EmailValueObject.create({
      email: 'otavio2011afonso@teste.com',
    });

    console.log(result.value);
  });
});
