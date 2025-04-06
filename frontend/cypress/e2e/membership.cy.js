// cypress/e2e/membership.cy.js

describe('Тестирование функций принадлежности', () => {
  beforeEach(() => {
    // Мокаем все API-запросы перед каждым тестом
    cy.intercept('GET', 'http://localhost:8000/api/videos/membership/', {
      statusCode: 200,
      body: []
    }).as('getVideos');
    
    cy.intercept('POST', 'http://localhost:8000/membership/calculate/', {
      statusCode: 200,
      fixture: 'graph-data.json'
    }).as('calculateGraph');
    
    cy.visit('/member');
  });

  it('Отображает заголовок "Функции принадлежности"', () => {
    cy.contains('h1', 'Функции принадлежности').should('be.visible');
  });

  it('Отображает параметры для выбранной функции', () => {
    // Проверяем параметры для S-функции (по умолчанию)
    cy.contains('label', /Параметр A/i).should('be.visible');
    cy.contains('label', /Параметр B/i).should('be.visible');
  });

  it('Позволяет ввести значения параметров', () => {
    // Очищаем и вводим новые значения
    cy.get('input[name="a"]').clear().type('2');
    cy.get('input[name="b"]').clear().type('5');
    
    // Проверяем значения
    cy.get('input[name="a"]').should('have.value', '21');
    cy.get('input[name="b"]').should('have.value', '55');
  });

  it('Отображает кнопку "Построить график"', () => {
    cy.contains('button', /Построить график/i).should('be.visible');
  });

  it('Открывает объяснение функции', () => {
    cy.contains('button', /Объяснение функции/i).click();
    cy.contains(/Объяснение S-функции/i).should('be.visible');
    cy.contains('button', /Закрыть/i).click();
  });

  it('Работает с видео', () => {
    cy.contains('button', /Видео/i).click();
    cy.contains(/Видео/i).should('be.visible');
    cy.contains('button', /Добавить видео/i).should('be.visible');
    cy.contains('button', /Закрыть/i).click();
  });

  it('Строит график при нажатии кнопки', () => {
    cy.contains('button', /Построить график/i).click();
    cy.wait('@calculateGraph');
    cy.get('canvas').should('be.visible'); // Проверяем наличие canvas элемента
  });
});