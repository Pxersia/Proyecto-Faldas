package cl.pxersia.faldascustom.service;

import cl.pxersia.faldascustom.dto.ProductRequest;
import cl.pxersia.faldascustom.dto.ProductResponse;
import cl.pxersia.faldascustom.entity.Product;
import cl.pxersia.faldascustom.exception.ResourceNotFoundException;
import cl.pxersia.faldascustom.mapper.ProductMapper;
import cl.pxersia.faldascustom.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public List<ProductResponse> findAllActive() {
        return productRepository.findAllByActiveTrue()
                .stream()
                .map(productMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return productMapper.toResponse(getProductOrThrow(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = productMapper.toEntity(request);
        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getProductOrThrow(id);
        productMapper.updateEntity(product, request);
        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = getProductOrThrow(id);
        product.setActive(false);
        productRepository.save(product);
    }

    private Product getProductOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id: " + id));
    }
}

