package cl.pxersia.faldascustom.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Formato de correo invÃ¡lido")
    private String email;

    @NotBlank(message = "La contraseÃ±a es obligatoria")
    private String password;
}

