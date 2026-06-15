package cl.pxersia.faldaandco.repository;

import cl.pxersia.faldaandco.entity.Address;
import cl.pxersia.faldaandco.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findAllByUser(User user);

    Optional<Address> findByIdAndUser(Long id, User user);
}