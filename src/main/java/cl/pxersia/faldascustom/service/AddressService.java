package cl.pxersia.faldascustom.service;

import cl.pxersia.faldascustom.dto.AddressRequest;
import cl.pxersia.faldascustom.dto.AddressResponse;
import cl.pxersia.faldascustom.entity.Address;
import cl.pxersia.faldascustom.entity.User;
import cl.pxersia.faldascustom.exception.ResourceNotFoundException;
import cl.pxersia.faldascustom.mapper.AddressMapper;
import cl.pxersia.faldascustom.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final AddressMapper addressMapper;

    @Transactional(readOnly = true)
    public List<AddressResponse> findByUser(User user) {
        return addressRepository.findAllByUser(user)
                .stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    @Transactional
    public AddressResponse create(AddressRequest request, User user) {
        // Si la nueva dirección se marca como default, quitar el default a las otras
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            clearDefaultAddresses(user);
        }
        Address address = addressMapper.toEntity(request, user);
        return addressMapper.toResponse(addressRepository.save(address));
    }

    @Transactional
    public void delete(Long id, User user) {
        Address address = addressRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Dirección no encontrada con id: " + id));
        addressRepository.delete(address);
    }

    private void clearDefaultAddresses(User user) {
        addressRepository.findAllByUser(user).forEach(a -> {
            a.setIsDefault(false);
            addressRepository.save(a);
        });
    }
}

