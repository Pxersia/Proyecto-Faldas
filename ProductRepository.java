package cl.pxersia.faldaandco.repository;

import cl.pxersia.faldaandco.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByActiveTrue();
}