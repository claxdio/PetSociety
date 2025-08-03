# Validación de Peso - Frontend y Backend

## Resumen

Se ha implementado un sistema completo de validación de peso tanto en el frontend (React) como en el backend (Django), siguiendo las mejores prácticas de desarrollo web.

## Frontend (React)

### Características implementadas:

1. **Validación en tiempo real**: El campo de peso se valida mientras el usuario escribe
2. **Múltiples formatos soportados**: kg, lbs, g, lb
3. **Rangos de validación**:
   - kg: 0.1 - 200 kg
   - lbs: 0.2 - 440 lbs
   - g: 100 - 200,000 g
   - lb: 0.2 - 440 lb
4. **Feedback visual**: Mensajes de error con iconos y estilos
5. **Prevención de envío**: El formulario no se envía si hay errores

### Código implementado:

```javascript
// Función de validación
const validarPeso = (peso) => {
  if (!peso.trim()) {
    return "El peso es requerido";
  }

  const pesoRegex = /^(\d+(?:\.\d+)?)\s*(kg|lbs|g|lb)?$/i;
  const match = peso.match(pesoRegex);

  if (!match) {
    return "Formato inválido. Use: número + unidad (ej: 5.2 kg, 12 lbs)";
  }

  const valor = parseFloat(match[1]);
  const unidad = match[2]?.toLowerCase() || "kg";

  // Validar rangos según la unidad
  if (unidad === "kg" && (valor < 0.1 || valor > 200)) {
    return "El peso debe estar entre 0.1 y 200 kg";
  }
  // ... más validaciones
};
```

## Backend (Django)

### Modelo CitaMedica:

```python
class CitaMedica(models.Model):
    peso = models.CharField(max_length=20)

    @staticmethod
    def validar_peso(peso):
        """Valida el formato y rango del peso"""
        import re

        peso_regex = r'^(\d+(?:\.\d+)?)\s*(kg|lbs|g|lb)?$'
        match = re.match(peso_regex, peso.strip(), re.IGNORECASE)

        if not match:
            raise ValidationError("Formato inválido...")

        valor = float(match.group(1))
        unidad = match.group(2).lower() if match.group(2) else 'kg'

        # Validar rangos según la unidad
        if unidad == 'kg' and (valor < 0.1 or valor > 200):
            raise ValidationError("El peso debe estar entre 0.1 y 200 kg")
        # ... más validaciones
```

### Serializer con validación:

```python
class CitaMedicaSerializer(serializers.ModelSerializer):
    def validate_peso(self, value):
        """Validación personalizada del campo peso"""
        if not value or not value.strip():
            raise serializers.ValidationError("El peso es requerido.")

        try:
            CitaMedica.validar_peso(value)
        except ValidationError as e:
            raise serializers.ValidationError(str(e))

        return value.strip()
```

### Endpoints disponibles:

1. **POST /api/citas-medicas/** - Crear cita con validación
2. **GET /api/citas-medicas/** - Listar citas del usuario
3. **PUT /api/citas-medicas/{id}/** - Actualizar cita
4. **DELETE /api/citas-medicas/{id}/** - Eliminar cita
5. **POST /api/validar-peso/** - Validar peso sin crear cita
6. **GET /api/citas-proximas/** - Obtener citas próximas

## Ventajas de esta implementación:

### Frontend:

✅ **Experiencia de usuario mejorada**: Validación inmediata
✅ **Reducción de errores**: Menos envíos de datos inválidos
✅ **Feedback visual claro**: Mensajes de error con iconos
✅ **Múltiples formatos**: Flexibilidad para el usuario

### Backend:

✅ **Seguridad**: Validación obligatoria en el servidor
✅ **Integridad de datos**: Garantiza datos válidos en la BD
✅ **Reutilización**: Función de validación reutilizable
✅ **API robusta**: Manejo de errores consistente

## Ejemplos de uso:

### Formatos válidos:

- `5.2 kg`
- `12 lbs`
- `3500 g`
- `3.5` (asume kg por defecto)
- `15 lb`

### Respuestas de error:

```json
{
  "peso": ["El peso debe estar entre 0.1 y 200 kg"]
}
```

### Respuesta exitosa:

```json
{
  "id": 1,
  "mascota": {...},
  "peso": "5.2 kg",
  "peso_normalizado": 5.2,
  "fecha_cita": "2024-01-15T10:00:00Z",
  ...
}
```

## Recomendaciones:

1. **Siempre validar en ambos lados**: Frontend para UX, Backend para seguridad
2. **Mantener consistencia**: Misma lógica de validación en ambos lados
3. **Documentar formatos**: Informar al usuario qué formatos son válidos
4. **Probar casos edge**: Validar con valores límite y formatos inusuales
5. **Considerar internacionalización**: Soporte para diferentes sistemas de medida

## Próximos pasos:

1. Crear migración para el modelo CitaMedica
2. Agregar URLs para los nuevos endpoints
3. Implementar tests unitarios para validaciones
4. Agregar más validaciones (fechas, campos requeridos, etc.)
5. Considerar integración con el componente Fechas existente
