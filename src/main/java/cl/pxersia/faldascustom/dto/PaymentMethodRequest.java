package cl.pxersia.faldascustom.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PaymentMethodRequest {

    @NotBlank(message = "El nombre del titular es obligatorio")
    private String cardHolder;

        @NotBlank(message = "El número de tarjeta es obligatorio")
        @Size(min = 16, max = 16, message = "El número de tarjeta debe tener 16 dígitos")
    @Pattern(regexp = "\\d{16}", message = "El número de tarjeta solo debe contener dígitos")
    private String cardNumber;

    @NotBlank(message = "El tipo de tarjeta es obligatorio")
    private String type;
}

