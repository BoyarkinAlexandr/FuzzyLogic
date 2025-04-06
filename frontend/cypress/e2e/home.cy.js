// cypress/e2e/home.cy.js

describe('Тестирование главной страницы', () => {
    beforeEach(() => {
      // Предполагаем, что компонент отображается на главной странице
      cy.visit('/');
    });
  
    it('Отображает заголовок "Главная страница"', () => {
      cy.contains('h1', 'Главная страница').should('be.visible');
    });
  
    it('Отображает карточки методов', () => {
      // Проверяем, что есть хотя бы одна карточка
      cy.get('.MuiCard-root').should('have.length.gt', 0);
      
      // Проверяем первую карточку
      cy.get('.MuiCard-root').first().within(() => {
        cy.get('h6').should('exist'); // Заголовок карточки
        cy.contains('Краткое описание').should('be.visible');
        cy.get('img').should('be.visible'); // Изображение
        cy.contains('Перейти').should('be.visible'); // Кнопка
      });
    });
  
    it('Раскрывает описание при клике', () => {
      cy.get('.MuiCard-root').first().within(() => {
        cy.contains('Краткое описание').click();
        // Проверяем, что появилось описание
        cy.get('.MuiTypography-body2').should('be.visible');
      });
    });
  });