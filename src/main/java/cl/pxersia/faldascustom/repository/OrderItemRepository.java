package cl.pxersia.faldascustom.repository;

import cl.pxersia.faldascustom.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}

