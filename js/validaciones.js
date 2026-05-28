document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('turnoForm');
  const especialidadSelect = document.getElementById('especialidad');
  const medicoSelect = document.getElementById('medico');
  const modalidadSelect = document.getElementById('modalidad');
  const plataformaGroup = document.getElementById('plataformaGroup');
  const plataformaSelect = document.getElementById('plataforma');
  const coberturaSelect = document.getElementById('cobertura');
  const credencialGroup = document.getElementById('credencialGroup');
  const numeroCredencial = document.getElementById('numeroCredencial');
  const planInput = document.getElementById('plan');
  const primeraVisitaCheckbox = document.getElementById('primeraVisita');
  const conocioGroup = document.getElementById('conocioGroup');
  const comoNosConocio = document.getElementById('comoNosConocio');
  const estudiosPreviosCheckbox = document.getElementById('estudiosPrevios');
  const descripcionEstudiosGroup = document.getElementById('descripcionEstudiosGroup');
  const descripcionEstudios = document.getElementById('descripcionEstudios');
  const confirmacion = document.getElementById('confirmacion');

  const medicosPorEspecialidad = {
    clinica: ['Dr. Gomez, Carlos', 'Dra. Lopez, Maria'],
    cardiologia: ['Dr. Perez, Juan', 'Dra. Torres, Ana'],
    pediatria: ['Dra. Diaz, Laura', 'Dr. Soto, Pablo'],
    ginecologia: ['Dra. Romero, Valeria', 'Dra. Castro, Elena'],
    traumatologia: ['Dr. Ramos, Sergio', 'Dr. Herrera, Diego'],
    neurologia: ['Dr. Molina, Andres', 'Dra. Vargas, Cecilia']
  };

  const validarTexto = (value) => {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    return regex.test(value.trim());
  };

  const validarEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  const validarTelefono = (value) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    const phoneRegex = /^[+\d\s-]{8,}$/;
    return phoneRegex.test(value.trim()) && cleaned.length >= 8;
  };

  const mostrarError = (field, message) => {
    limpiarCampo(field);
    field.classList.add('campo-error');
    const error = document.createElement('span');
    error.className = 'mensaje-error';
    error.textContent = message;
    field.insertAdjacentElement('afterend', error);
  };

  const marcarOk = (field) => {
    limpiarCampo(field);
    field.classList.add('campo-ok');
  };

  const limpiarCampo = (field) => {
    field.classList.remove('campo-error', 'campo-ok');
    const next = field.nextElementSibling;
    if (next && next.classList.contains('mensaje-error')) {
      next.remove();
    }
  };

  const actualizarMedicos = () => {
    const especialidad = especialidadSelect.value;
    medicoSelect.innerHTML = '';

    if (!especialidad || !medicosPorEspecialidad[especialidad]) {
      medicoSelect.innerHTML = '<option value="">Selecciona una especialidad primero</option>';
      medicoSelect.disabled = true;
      medicoSelect.required = false;
      return;
    }

    medicoSelect.disabled = false;
    medicoSelect.required = true;
    medicoSelect.innerHTML = '<option value="">Selecciona un médico</option>' +
      medicosPorEspecialidad[especialidad]
        .map((nombre) => `<option value="${nombre}">${nombre}</option>`)
        .join('');
  };

  const actualizarPlataforma = () => {
    const esVideo = modalidadSelect.value === 'videoconsulta';
    plataformaGroup.classList.toggle('hidden', !esVideo);
    plataformaSelect.style.display = esVideo ? 'block' : 'none';
    plataformaSelect.required = esVideo;
    if (!esVideo) {
      limpiarCampo(plataformaSelect);
    }
  };

  const actualizarCobertura = () => {
    const esParticular = coberturaSelect.value === 'particular';
    credencialGroup.classList.toggle('hidden', esParticular);
    numeroCredencial.required = !esParticular;
    planInput.required = !esParticular;
    numeroCredencial.style.display = esParticular ? 'none' : 'block';
    planInput.style.display = esParticular ? 'none' : 'block';
    if (esParticular) {
      limpiarCampo(numeroCredencial);
      limpiarCampo(planInput);
    }
  };

  const actualizarConocio = () => {
    const esPrimeraVisita = primeraVisitaCheckbox.checked;
    conocioGroup.classList.toggle('hidden', !esPrimeraVisita);
    comoNosConocio.style.display = esPrimeraVisita ? 'block' : 'none';
    comoNosConocio.required = esPrimeraVisita;
    if (!esPrimeraVisita) {
      limpiarCampo(comoNosConocio);
    }
  };

  const actualizarDescripcionEstudios = () => {
    const tieneEstudios = estudiosPreviosCheckbox.checked;
    descripcionEstudiosGroup.classList.toggle('hidden', !tieneEstudios);
    descripcionEstudios.style.display = tieneEstudios ? 'block' : 'none';
    descripcionEstudios.required = tieneEstudios;
    if (!tieneEstudios) {
      limpiarCampo(descripcionEstudios);
    }
  };

  const obtenerTextoOpcion = (select) => {
    const opcion = select.options[select.selectedIndex];
    return opcion ? opcion.textContent : '';
  };

  const validarFechaNacimiento = (value) => {
    if (!value) return 'La fecha de nacimiento es obligatoria.';
    const hoy = new Date();
    const nacimiento = new Date(value + 'T00:00');
    if (isNaN(nacimiento.getTime())) return 'Fecha inválida.';
    if (nacimiento > hoy) return 'La fecha no puede ser futura.';

    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    const dia = hoy.getDate() - nacimiento.getDate();
    const edadReal = mes < 0 || (mes === 0 && dia < 0) ? edad - 1 : edad;
    if (edadReal < 0 || edadReal > 120) return 'La edad debe estar entre 0 y 120 años.';
    return '';
  };

  const validarFechaTurno = (value) => {
    if (!value) return 'La fecha del turno es obligatoria.';
    const ahora = new Date();
    const fechaSeleccionada = new Date(value + 'T00:00');
    if (isNaN(fechaSeleccionada.getTime())) return 'Fecha inválida.';
    const diasemana = fechaSeleccionada.getDay();
    if (diasemana === 0 || diasemana === 6) return 'El turno debe ser de lunes a viernes.';

    const fechaLimite = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
    if (fechaSeleccionada < new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())) {
      return 'La fecha del turno no puede ser pasada.';
    }
    if (fechaSeleccionada < fechaLimite) {
      return 'El turno debe solicitarse con al menos 24 horas de anticipación.';
    }
    return '';
  };

  const validarHoraTurno = (value) => {
    if (!value) return 'La hora del turno es obligatoria.';
    const [hora, minuto] = value.split(':').map(Number);
    if (Number.isNaN(hora) || Number.isNaN(minuto)) return 'Hora inválida.';
    if (hora < 8 || hora > 20 || (hora === 20 && minuto > 0)) {
      return 'La hora debe estar entre 08:00 y 20:00.';
    }
    return '';
  };

  const validarFormulario = () => {
    let errores = [];

    const campos = [
      { field: document.getElementById('nombre'), validator: (value) => {
          if (!value.trim()) return 'El nombre es obligatorio.';
          if (!validarTexto(value)) return 'Solo se permiten letras y espacios.';
          return '';
        }
      },
      { field: document.getElementById('apellido'), validator: (value) => {
          if (!value.trim()) return 'El apellido es obligatorio.';
          if (!validarTexto(value)) return 'Solo se permiten letras y espacios.';
          return '';
        }
      },
      { field: document.getElementById('dni'), validator: (value) => {
          if (!value.trim()) return 'El DNI es obligatorio.';
          if (!/^\d{7,8}$/.test(value.trim())) return 'El DNI debe tener entre 7 y 8 dígitos.';
          return '';
        }
      },
      { field: document.getElementById('email'), validator: (value) => {
          if (!value.trim()) return 'El correo es obligatorio.';
          if (!validarEmail(value)) return 'Ingresa un correo válido.';
          return '';
        }
      },
      { field: document.getElementById('telefono'), validator: (value) => {
          if (!value.trim()) return 'El teléfono es obligatorio.';
          if (!validarTelefono(value)) return 'Ingresa un teléfono válido con al menos 8 dígitos.';
          return '';
        }
      },
      { field: document.getElementById('nacimiento'), validator: (value) => validarFechaNacimiento(value) },
      { field: document.getElementById('genero'), validator: (value) => value ? '' : 'Selecciona un género.' },
      { field: especialidadSelect, validator: (value) => value ? '' : 'Selecciona una especialidad.' },
      { field: medicoSelect, validator: (value) => {
          if (medicoSelect.disabled) return '';
          return value ? '' : 'Selecciona un médico.';
        }
      },
      { field: document.getElementById('tipoConsulta'), validator: (value) => value ? '' : 'Selecciona el tipo de consulta.' },
      { field: document.getElementById('fechaTurno'), validator: (value) => validarFechaTurno(value) },
      { field: document.getElementById('horaTurno'), validator: (value) => validarHoraTurno(value) },
      { field: modalidadSelect, validator: (value) => value ? '' : 'Selecciona una modalidad.' },
      { field: coberturaSelect, validator: (value) => value ? '' : 'Selecciona una cobertura.' },
      { field: numeroCredencial, validator: (value) => {
          if (numeroCredencial.closest('.hidden')) return '';
          if (!value.trim()) return 'El número de credencial es obligatorio.';
          if (!/^[A-Za-z0-9]{5,}$/.test(value.trim())) return 'La credencial debe tener al menos 5 caracteres alfanuméricos.';
          return '';
        }
      },
      { field: planInput, validator: (value) => {
          if (planInput.closest('.hidden')) return '';
          return value.trim() ? '' : 'El plan es obligatorio.';
        }
      },
      { field: comoNosConocio, validator: (value) => {
          if (comoNosConocio.closest('.hidden')) return '';
          return value ? '' : 'Indica cómo nos conociste.';
        }
      },
      { field: document.getElementById('motivoConsulta'), validator: (value) => {
          if (!value.trim()) return 'El motivo de la consulta es obligatorio.';
          if (value.trim().length < 20) return 'El motivo debe tener al menos 20 caracteres.';
          return '';
        }
      },
      { field: descripcionEstudios, validator: (value) => {
          if (descripcionEstudios.closest('.hidden')) return '';
          if (!value.trim()) return 'La descripción de estudios es obligatoria.';
          if (value.trim().length < 20) return 'La descripción debe tener al menos 20 caracteres.';
          return '';
        }
      },
      { field: plataformaSelect, validator: (value) => {
          if (plataformaSelect.closest('.hidden')) return '';
          return value ? '' : 'Selecciona una plataforma.';
        }
      }
    ];

    campos.forEach(({ field, validator }) => {
      if (field.closest('.hidden')) {
        limpiarCampo(field);
        return;
      }

      const error = validator(field.value || '');
      if (error) {
        mostrarError(field, error);
        errores.push(field);
      } else {
        marcarOk(field);
      }
    });

    return errores;
  };

  const serializarEspecialidad = (value) => {
    const mapa = {
      clinica: 'Clínica General',
      cardiologia: 'Cardiología',
      pediatria: 'Pediatría',
      ginecologia: 'Ginecología',
      traumatologia: 'Traumatología',
      neurologia: 'Neurología'
    };
    return mapa[value] || '';
  };

  const manejarEnvio = (event) => {
    event.preventDefault();
    confirmacion.classList.add('hidden');
    confirmacion.innerHTML = '';

    const errores = validarFormulario();
    if (errores.length > 0) {
      errores[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const turnoId = `TURN-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;
    const nombre = document.getElementById('nombre').value.trim();
    const especialidad = serializarEspecialidad(especialidadSelect.value);
    const fecha = document.getElementById('fechaTurno').value;
    const hora = document.getElementById('horaTurno').value;

    confirmacion.innerHTML = `
      <h2>Turno reservado</h2>
      <p><strong>Paciente:</strong> ${nombre}</p>
      <p><strong>Especialidad:</strong> ${especialidad}</p>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Hora:</strong> ${hora}</p>
      <p><strong>Número de turno:</strong> ${turnoId}</p>
    `;
    confirmacion.classList.remove('hidden');
    confirmacion.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  especialidadSelect.addEventListener('change', () => {
    actualizarMedicos();
    limpiarCampo(especialidadSelect);
    limpiarCampo(medicoSelect);
  });

  modalidadSelect.addEventListener('change', () => {
    actualizarPlataforma();
    limpiarCampo(modalidadSelect);
    limpiarCampo(plataformaSelect);
  });

  coberturaSelect.addEventListener('change', () => {
    actualizarCobertura();
    limpiarCampo(coberturaSelect);
    limpiarCampo(numeroCredencial);
    limpiarCampo(planInput);
  });

  primeraVisitaCheckbox.addEventListener('change', () => {
    actualizarConocio();
    limpiarCampo(primeraVisitaCheckbox);
    limpiarCampo(comoNosConocio);
  });

  estudiosPreviosCheckbox.addEventListener('change', () => {
    actualizarDescripcionEstudios();
    limpiarCampo(estudiosPreviosCheckbox);
    limpiarCampo(descripcionEstudios);
  });

  actualizarMedicos();
  actualizarPlataforma();
  actualizarCobertura();
  actualizarConocio();
  actualizarDescripcionEstudios();

  form.addEventListener('submit', manejarEnvio);
});
