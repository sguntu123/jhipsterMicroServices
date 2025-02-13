package com.jhipster.demo.invoice.repository;

import com.jhipster.demo.invoice.domain.Shipment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Shipment entity.
 */
@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    default Optional<Shipment> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Shipment> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Shipment> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select shipment from Shipment shipment left join fetch shipment.invoice",
        countQuery = "select count(shipment) from Shipment shipment"
    )
    Page<Shipment> findAllWithToOneRelationships(Pageable pageable);

    @Query("select shipment from Shipment shipment left join fetch shipment.invoice")
    List<Shipment> findAllWithToOneRelationships();

    @Query("select shipment from Shipment shipment left join fetch shipment.invoice where shipment.id =:id")
    Optional<Shipment> findOneWithToOneRelationships(@Param("id") Long id);
}
