import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './invoice.reducer';

export const Invoice = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const invoiceList = useAppSelector(state => state.store.invoice.entities);
  const loading = useAppSelector(state => state.store.invoice.loading);
  const totalItems = useAppSelector(state => state.store.invoice.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="invoice-heading" data-cy="InvoiceHeading">
        <Translate contentKey="storeApp.invoiceInvoice.home.title">Invoices</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="storeApp.invoiceInvoice.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/invoice/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="storeApp.invoiceInvoice.home.createLabel">Create new Invoice</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {invoiceList && invoiceList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="storeApp.invoiceInvoice.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('code')}>
                  <Translate contentKey="storeApp.invoiceInvoice.code">Code</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('code')} />
                </th>
                <th className="hand" onClick={sort('date')}>
                  <Translate contentKey="storeApp.invoiceInvoice.date">Date</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('date')} />
                </th>
                <th className="hand" onClick={sort('details')}>
                  <Translate contentKey="storeApp.invoiceInvoice.details">Details</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('details')} />
                </th>
                <th className="hand" onClick={sort('status')}>
                  <Translate contentKey="storeApp.invoiceInvoice.status">Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('status')} />
                </th>
                <th className="hand" onClick={sort('paymentMethod')}>
                  <Translate contentKey="storeApp.invoiceInvoice.paymentMethod">Payment Method</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('paymentMethod')} />
                </th>
                <th className="hand" onClick={sort('paymentDate')}>
                  <Translate contentKey="storeApp.invoiceInvoice.paymentDate">Payment Date</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('paymentDate')} />
                </th>
                <th className="hand" onClick={sort('paymentAmount')}>
                  <Translate contentKey="storeApp.invoiceInvoice.paymentAmount">Payment Amount</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('paymentAmount')} />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoiceList.map((invoice, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/invoice/${invoice.id}`} color="link" size="sm">
                      {invoice.id}
                    </Button>
                  </td>
                  <td>{invoice.code}</td>
                  <td>{invoice.date ? <TextFormat type="date" value={invoice.date} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{invoice.details}</td>
                  <td>
                    <Translate contentKey={`storeApp.InvoiceStatus.${invoice.status}`} />
                  </td>
                  <td>
                    <Translate contentKey={`storeApp.PaymentMethod.${invoice.paymentMethod}`} />
                  </td>
                  <td>{invoice.paymentDate ? <TextFormat type="date" value={invoice.paymentDate} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{invoice.paymentAmount}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/invoice/${invoice.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/invoice/${invoice.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() =>
                          (window.location.href = `/invoice/${invoice.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="storeApp.invoiceInvoice.home.notFound">No Invoices found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={invoiceList && invoiceList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Invoice;
