import { setupRoutes } from './breadcrumbs';

const routes = {
  '/': 'APM',
  '/:appName': {
    url: params => `/${params.appName}/transactions`,
    label: params => params.appName
  },
  '/:appName/errors': 'Errors',
  '/:appName/errors/:groupId': params => params.groupId,
  '/:appName/transactions': {
    skip: true
  },
  '/:appName/transactions/:transactionType': params => params.transactionType,
  '/:appName/transactions/:transactionType/:transactionName': params =>
    params.transactionName.replace(/~2F/g, '/')
};

describe('breadcrumbs', () => {
  it('/:appName', () => {
    expect(setupRoutes(routes)('/opbeans-backend')).toEqual([
      { label: 'APM', url: '/' },
      { label: 'opbeans-backend', url: '/opbeans-backend/transactions' }
    ]);
  });

  it('/:appName/errors', () => {
    expect(setupRoutes(routes)('/opbeans-backend/errors')).toEqual([
      { label: 'APM', url: '/' },
      { label: 'opbeans-backend', url: '/opbeans-backend/transactions' },
      { label: 'Errors', url: '/opbeans-backend/errors' }
    ]);
  });

  it('/:appName/errors/:groupId', () => {
    expect(
      setupRoutes(routes)(
        '/opbeans-backend/errors/a43bcaa33f1577ca6b5d99f05faa4e07'
      )
    ).toEqual([
      { label: 'APM', url: '/' },
      { label: 'opbeans-backend', url: '/opbeans-backend/transactions' },
      { label: 'Errors', url: '/opbeans-backend/errors' },
      {
        label: 'a43bcaa33f1577ca6b5d99f05faa4e07',
        url: '/opbeans-backend/errors/a43bcaa33f1577ca6b5d99f05faa4e07'
      }
    ]);
  });

  it('/:appName/transactions', () => {
    expect(setupRoutes(routes)('/opbeans-backend/transactions')).toEqual([
      { label: 'APM', url: '/' },
      { label: 'opbeans-backend', url: '/opbeans-backend/transactions' }
    ]);
  });

  it('/:appName/transactions/:transactionType', () => {
    expect(
      setupRoutes(routes)('/opbeans-backend/transactions/request')
    ).toEqual([
      { label: 'APM', url: '/' },
      { label: 'opbeans-backend', url: '/opbeans-backend/transactions' },
      { label: 'request', url: '/opbeans-backend/transactions/request' }
    ]);
  });

  it('/:appName/transactions/:transactionType/:transactionName', () => {
    expect(
      setupRoutes(routes)(
        '/opbeans-backend/transactions/request/GET ~2Fapi~2Fstats'
      )
    ).toEqual([
      { label: 'APM', url: '/' },
      { label: 'opbeans-backend', url: '/opbeans-backend/transactions' },
      { label: 'request', url: '/opbeans-backend/transactions/request' },
      {
        label: 'GET /api/stats',
        url: '/opbeans-backend/transactions/request/GET ~2Fapi~2Fstats'
      }
    ]);
  });
});
