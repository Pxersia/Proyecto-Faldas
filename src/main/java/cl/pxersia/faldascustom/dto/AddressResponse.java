package cl.pxersia.faldascustom.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {

    private Long id;
    private String street;
    private String city;
    private String region;
    private String zipCode;
    private Boolean isDefault;
}

