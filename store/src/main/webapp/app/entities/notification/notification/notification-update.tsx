import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { NotificationType } from 'app/shared/model/enumerations/notification-type.model';
import { createEntity, getEntity, reset, updateEntity } from './notification.reducer';

export const NotificationUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notificationEntity = useAppSelector(state => state.store.notification.entity);
  const loading = useAppSelector(state => state.store.notification.loading);
  const updating = useAppSelector(state => state.store.notification.updating);
  const updateSuccess = useAppSelector(state => state.store.notification.updateSuccess);
  const notificationTypeValues = Object.keys(NotificationType);

  const handleClose = () => {
    navigate('/notification');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    values.date = convertDateTimeToServer(values.date);
    values.sentDate = convertDateTimeToServer(values.sentDate);
    if (values.userId !== undefined && typeof values.userId !== 'number') {
      values.userId = Number(values.userId);
    }
    if (values.productId !== undefined && typeof values.productId !== 'number') {
      values.productId = Number(values.productId);
    }

    const entity = {
      ...notificationEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          date: displayDefaultDateTime(),
          sentDate: displayDefaultDateTime(),
        }
      : {
          format: 'EMAIL',
          ...notificationEntity,
          date: convertDateTimeFromServer(notificationEntity.date),
          sentDate: convertDateTimeFromServer(notificationEntity.sentDate),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="storeApp.notificationNotification.home.createOrEditLabel" data-cy="NotificationCreateUpdateHeading">
            <Translate contentKey="storeApp.notificationNotification.home.createOrEditLabel">Create or edit a Notification</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="notification-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('storeApp.notificationNotification.date')}
                id="notification-date"
                name="date"
                data-cy="date"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('storeApp.notificationNotification.details')}
                id="notification-details"
                name="details"
                data-cy="details"
                type="text"
              />
              <ValidatedField
                label={translate('storeApp.notificationNotification.sentDate')}
                id="notification-sentDate"
                name="sentDate"
                data-cy="sentDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('storeApp.notificationNotification.format')}
                id="notification-format"
                name="format"
                data-cy="format"
                type="select"
              >
                {notificationTypeValues.map(notificationType => (
                  <option value={notificationType} key={notificationType}>
                    {translate(`storeApp.NotificationType.${notificationType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('storeApp.notificationNotification.userId')}
                id="notification-userId"
                name="userId"
                data-cy="userId"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('storeApp.notificationNotification.productId')}
                id="notification-productId"
                name="productId"
                data-cy="productId"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/notification" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default NotificationUpdate;
