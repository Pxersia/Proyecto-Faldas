package cl.pxersia.faldascustom.repository;

import cl.pxersia.faldascustom.entity.PaymentMethod;
import cl.pxersia.faldascustom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {

    List<PaymentMethod> findAllByUser(User user);

    Optional<PaymentMethod> findByIdAndUser(Long id, User user);
}

