import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('OrderItem e2e test', () => {
  const orderItemPageUrl = '/order-item';
  const orderItemPageUrlPattern = new RegExp('/order-item(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const orderItemSample = { quantity: 23978, totalPrice: 22062.42, status: 'BACK_ORDER' };

  let orderItem;
  let product;
  let productOrder;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/product/api/products',
      body: {
        name: 'unlike along',
        description: 'appreciate',
        price: 22277.09,
        productSize: 'L',
        image: 'Li4vZmFrZS1kYXRhL2Jsb2IvaGlwc3Rlci5wbmc=',
        imageContentType: 'unknown',
      },
    }).then(({ body }) => {
      product = body;
    });
    // create an instance at the required relationship entity:
    cy.authenticatedRequest({
      method: 'POST',
      url: '/services/product/api/product-orders',
      body: { placedDate: '2025-02-10T23:18:38.620Z', status: 'COMPLETED', code: 'gosh', invoiceId: 14899, customer: 'provided past aw' },
    }).then(({ body }) => {
      productOrder = body;
    });
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/product/api/order-items+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/product/api/order-items').as('postEntityRequest');
    cy.intercept('DELETE', '/services/product/api/order-items/*').as('deleteEntityRequest');
  });

  beforeEach(() => {
    // Simulate relationships api for better performance and reproducibility.
    cy.intercept('GET', '/services/product/api/products', {
      statusCode: 200,
      body: [product],
    });

    cy.intercept('GET', '/services/product/api/product-orders', {
      statusCode: 200,
      body: [productOrder],
    });
  });

  afterEach(() => {
    if (orderItem) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/product/api/order-items/${orderItem.id}`,
      }).then(() => {
        orderItem = undefined;
      });
    }
  });

  afterEach(() => {
    if (product) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/product/api/products/${product.id}`,
      }).then(() => {
        product = undefined;
      });
    }
    if (productOrder) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/product/api/product-orders/${productOrder.id}`,
      }).then(() => {
        productOrder = undefined;
      });
    }
  });

  it('OrderItems menu should load OrderItems page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('order-item');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('OrderItem').should('exist');
    cy.url().should('match', orderItemPageUrlPattern);
  });

  describe('OrderItem page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(orderItemPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create OrderItem page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/order-item/new$'));
        cy.getEntityCreateUpdateHeading('OrderItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', orderItemPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/product/api/order-items',
          body: {
            ...orderItemSample,
            product,
            order: productOrder,
          },
        }).then(({ body }) => {
          orderItem = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/product/api/order-items+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/product/api/order-items?page=0&size=20>; rel="last",<http://localhost/services/product/api/order-items?page=0&size=20>; rel="first"',
              },
              body: [orderItem],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(orderItemPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details OrderItem page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('orderItem');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', orderItemPageUrlPattern);
      });

      it('edit button click should load edit OrderItem page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OrderItem');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', orderItemPageUrlPattern);
      });

      it('edit button click should load edit OrderItem page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('OrderItem');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', orderItemPageUrlPattern);
      });

      it('last delete button click should delete instance of OrderItem', () => {
        cy.intercept('GET', '/services/product/api/order-items/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('orderItem').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', orderItemPageUrlPattern);

        orderItem = undefined;
      });
    });
  });

  describe('new OrderItem page', () => {
    beforeEach(() => {
      cy.visit(`${orderItemPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('OrderItem');
    });

    it('should create an instance of OrderItem', () => {
      cy.get(`[data-cy="quantity"]`).type('31093');
      cy.get(`[data-cy="quantity"]`).should('have.value', '31093');

      cy.get(`[data-cy="totalPrice"]`).type('18453.01');
      cy.get(`[data-cy="totalPrice"]`).should('have.value', '18453.01');

      cy.get(`[data-cy="status"]`).select('BACK_ORDER');

      cy.get(`[data-cy="product"]`).select(1);
      cy.get(`[data-cy="order"]`).select(1);

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        orderItem = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', orderItemPageUrlPattern);
    });
  });
});
