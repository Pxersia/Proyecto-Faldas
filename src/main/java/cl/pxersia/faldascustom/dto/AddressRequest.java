package cl.pxersia.faldascustom.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AddressRequest {

    @NotBlank(message = "La calle es obligatoria")
    private String street;

    @NotBlank(message = "La ciudad es obligatoria")
    private String city;

    @NotBlank(message = "La regiÃ³n es obligatoria")
    private String region;

    private String zipCode;

    private Boolean isDefault = false;
}

