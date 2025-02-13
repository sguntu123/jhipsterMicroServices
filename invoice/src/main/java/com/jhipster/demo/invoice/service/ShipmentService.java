package com.jhipster.demo.invoice.service;

import com.jhipster.demo.invoice.domain.Shipment;
import com.jhipster.demo.invoice.repository.ShipmentRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.jhipster.demo.invoice.domain.Shipment}.
 */
@Service
@Transactional
public class ShipmentService {

    private static final Logger LOG = LoggerFactory.getLogger(ShipmentService.class);

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    /**
     * Save a shipment.
     *
     * @param shipment the entity to save.
     * @return the persisted entity.
     */
    public Shipment save(Shipment shipment) {
        LOG.debug("Request to save Shipment : {}", shipment);
        return shipmentRepository.save(shipment);
    }

    /**
     * Update a shipment.
     *
     * @param shipment the entity to save.
     * @return the persisted entity.
     */
    public Shipment update(Shipment shipment) {
        LOG.debug("Request to update Shipment : {}", shipment);
        return shipmentRepository.save(shipment);
    }

    /**
     * Partially update a shipment.
     *
     * @param shipment the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Shipment> partialUpdate(Shipment shipment) {
        LOG.debug("Request to partially update Shipment : {}", shipment);

        return shipmentRepository
            .findById(shipment.getId())
            .map(existingShipment -> {
                if (shipment.getTrackingCode() != null) {
                    existingShipment.setTrackingCode(shipment.getTrackingCode());
                }
                if (shipment.getDate() != null) {
                    existingShipment.setDate(shipment.getDate());
                }
                if (shipment.getDetails() != null) {
                    existingShipment.setDetails(shipment.getDetails());
                }

                return existingShipment;
            })
            .map(shipmentRepository::save);
    }

    /**
     * Get all the shipments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Shipment> findAll(Pageable pageable) {
        LOG.debug("Request to get all Shipments");
        return shipmentRepository.findAll(pageable);
    }

    /**
     * Get all the shipments with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Shipment> findAllWithEagerRelationships(Pageable pageable) {
        return shipmentRepository.findAllWithEagerRelationships(pageable);
    }

    /**
     * Get one shipment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Shipment> findOne(Long id) {
        LOG.debug("Request to get Shipment : {}", id);
        return shipmentRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the shipment by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Shipment : {}", id);
        shipmentRepository.deleteById(id);
    }
}
