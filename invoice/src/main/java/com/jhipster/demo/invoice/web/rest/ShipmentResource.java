package com.jhipster.demo.invoice.web.rest;

import com.jhipster.demo.invoice.domain.Shipment;
import com.jhipster.demo.invoice.repository.ShipmentRepository;
import com.jhipster.demo.invoice.service.ShipmentService;
import com.jhipster.demo.invoice.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.jhipster.demo.invoice.domain.Shipment}.
 */
@RestController
@RequestMapping("/api/shipments")
public class ShipmentResource {

    private static final Logger LOG = LoggerFactory.getLogger(ShipmentResource.class);

    private static final String ENTITY_NAME = "invoiceShipment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ShipmentService shipmentService;

    private final ShipmentRepository shipmentRepository;

    public ShipmentResource(ShipmentService shipmentService, ShipmentRepository shipmentRepository) {
        this.shipmentService = shipmentService;
        this.shipmentRepository = shipmentRepository;
    }

    /**
     * {@code POST  /shipments} : Create a new shipment.
     *
     * @param shipment the shipment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new shipment, or with status {@code 400 (Bad Request)} if the shipment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Shipment> createShipment(@Valid @RequestBody Shipment shipment) throws URISyntaxException {
        LOG.debug("REST request to save Shipment : {}", shipment);
        if (shipment.getId() != null) {
            throw new BadRequestAlertException("A new shipment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        shipment = shipmentService.save(shipment);
        return ResponseEntity.created(new URI("/api/shipments/" + shipment.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, shipment.getId().toString()))
            .body(shipment);
    }

    /**
     * {@code PUT  /shipments/:id} : Updates an existing shipment.
     *
     * @param id the id of the shipment to save.
     * @param shipment the shipment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shipment,
     * or with status {@code 400 (Bad Request)} if the shipment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the shipment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Shipment> updateShipment(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Shipment shipment
    ) throws URISyntaxException {
        LOG.debug("REST request to update Shipment : {}, {}", id, shipment);
        if (shipment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shipment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shipmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        shipment = shipmentService.update(shipment);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shipment.getId().toString()))
            .body(shipment);
    }

    /**
     * {@code PATCH  /shipments/:id} : Partial updates given fields of an existing shipment, field will ignore if it is null
     *
     * @param id the id of the shipment to save.
     * @param shipment the shipment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated shipment,
     * or with status {@code 400 (Bad Request)} if the shipment is not valid,
     * or with status {@code 404 (Not Found)} if the shipment is not found,
     * or with status {@code 500 (Internal Server Error)} if the shipment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Shipment> partialUpdateShipment(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Shipment shipment
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Shipment partially : {}, {}", id, shipment);
        if (shipment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, shipment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!shipmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Shipment> result = shipmentService.partialUpdate(shipment);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, shipment.getId().toString())
        );
    }

    /**
     * {@code GET  /shipments} : get all the shipments.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of shipments in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Shipment>> getAllShipments(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of Shipments");
        Page<Shipment> page;
        if (eagerload) {
            page = shipmentService.findAllWithEagerRelationships(pageable);
        } else {
            page = shipmentService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /shipments/:id} : get the "id" shipment.
     *
     * @param id the id of the shipment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the shipment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getShipment(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Shipment : {}", id);
        Optional<Shipment> shipment = shipmentService.findOne(id);
        return ResponseUtil.wrapOrNotFound(shipment);
    }

    /**
     * {@code DELETE  /shipments/:id} : delete the "id" shipment.
     *
     * @param id the id of the shipment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Shipment : {}", id);
        shipmentService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
