package cl.pxersia.faldaandco.repository;

import cl.pxersia.faldaandco.entity.Order;
import cl.pxersia.faldaandco.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByUserOrderByCreatedAtDesc(User user);
}