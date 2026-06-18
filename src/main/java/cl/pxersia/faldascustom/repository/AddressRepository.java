package cl.pxersia.faldascustom.repository;

import cl.pxersia.faldascustom.entity.Address;
import cl.pxersia.faldascustom.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findAllByUser(User user);

    Optional<Address> findByIdAndUser(Long id, User user);
}

