package cl.pxersia.faldascustom.repository;

import cl.pxersia.faldascustom.entity.Order;
import cl.pxersia.faldascustom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByUserOrderByCreatedAtDesc(User user);
}

