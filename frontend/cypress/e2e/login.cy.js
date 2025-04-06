// cypress/e2e/login.cy.js

describe('Тестирование страницы входа', () => {
    beforeEach(() => {
      // Мокаем API-запросы
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: { 
          success: true,
          token: 'test-token',
          user: { email: 'test@example.com' }
        },
        delay: 1000 // Имитируем задержку сервера
      }).as('loginRequest');
      
      // Переходим на страницу входа
      cy.visit('/login');
    });
  
    it('Отображает основные элементы страницы', () => {
      cy.contains('h4', 'Войти').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.contains('button', 'Войти').should('be.visible');
      cy.contains('button', 'Зарегистрироваться').should('be.visible');
      cy.contains('a', 'Забыли пароль?').should('be.visible');
    });
  
    it('Показывает ошибку при пустых полях', () => {
      cy.contains('button', 'Войти').click();
      cy.contains('Пожалуйста, заполните все поля!').should('be.visible');
    });
  });