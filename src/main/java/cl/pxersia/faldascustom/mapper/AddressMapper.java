package cl.pxersia.faldascustom.mapper;

import cl.pxersia.faldascustom.dto.AddressRequest;
import cl.pxersia.faldascustom.dto.AddressResponse;
import cl.pxersia.faldascustom.entity.Address;
import cl.pxersia.faldascustom.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {

    public Address toEntity(AddressRequest request, User user) {
        return Address.builder()
                .user(user)
                .street(request.getStreet())
                .city(request.getCity())
                .region(request.getRegion())
                .zipCode(request.getZipCode())
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .build();
    }

    public AddressResponse toResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .street(address.getStreet())
                .city(address.getCity())
                .region(address.getRegion())
                .zipCode(address.getZipCode())
                .isDefault(address.getIsDefault())
                .build();
    }
}

