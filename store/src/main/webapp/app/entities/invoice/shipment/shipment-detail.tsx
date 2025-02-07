import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './shipment.reducer';

export const ShipmentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const shipmentEntity = useAppSelector(state => state.store.shipment.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="shipmentDetailsHeading">
          <Translate contentKey="storeApp.invoiceShipment.detail.title">Shipment</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{shipmentEntity.id}</dd>
          <dt>
            <span id="trackingCode">
              <Translate contentKey="storeApp.invoiceShipment.trackingCode">Tracking Code</Translate>
            </span>
          </dt>
          <dd>{shipmentEntity.trackingCode}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="storeApp.invoiceShipment.date">Date</Translate>
            </span>
          </dt>
          <dd>{shipmentEntity.date ? <TextFormat value={shipmentEntity.date} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="details">
              <Translate contentKey="storeApp.invoiceShipment.details">Details</Translate>
            </span>
          </dt>
          <dd>{shipmentEntity.details}</dd>
          <dt>
            <Translate contentKey="storeApp.invoiceShipment.invoice">Invoice</Translate>
          </dt>
          <dd>{shipmentEntity.invoice ? shipmentEntity.invoice.code : ''}</dd>
        </dl>
        <Button tag={Link} to="/shipment" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/shipment/${shipmentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ShipmentDetail;
