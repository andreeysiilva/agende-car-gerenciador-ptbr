
import { useErrorHandler } from './useErrorHandler';
import { validateAppointmentDate } from '@/utils/dateValidation';

interface AppointmentData {
  cliente: string;
  servico: string;
  data_agendamento: string;
  horario: string;
  equipe?: string;
  observacoes?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function useAppointmentValidation() {
  const { setFieldError, clearError, errors } = useErrorHandler();

  const validateAppointment = (data: AppointmentData, existingAppointments: any[] = []): ValidationResult => {
    const validationErrors: Record<string, string> = {};

    // Validar cliente
    if (!data.cliente?.trim()) {
      validationErrors.cliente = 'Nome do cliente é obrigatório';
    }

    // Validar serviço
    if (!data.servico?.trim()) {
      validationErrors.servico = 'Serviço é obrigatório';
    }

    // Validar data
    if (!data.data_agendamento) {
      validationErrors.data_agendamento = 'Data é obrigatória';
    } else {
      try {
        const appointmentDate = new Date(data.data_agendamento);
        const dateValidation = validateAppointmentDate(appointmentDate);
        if (!dateValidation.isValid) {
          validationErrors.data_agendamento = dateValidation.error || 'Data inválida';
        }
      } catch (error) {
        validationErrors.data_agendamento = 'Data inválida';
      }
    }

    // Validar horário
    if (!data.horario?.trim()) {
      validationErrors.horario = 'Horário é obrigatório';
    }

    // Validar conflitos de horário
    if (data.data_agendamento && data.horario && existingAppointments.length > 0) {
      const hasConflict = existingAppointments.some(appointment => 
        appointment.data_agendamento === data.data_agendamento && 
        appointment.horario === data.horario &&
        appointment.status !== 'cancelado'
      );

      if (hasConflict) {
        validationErrors.horario = 'Já existe um agendamento neste horário';
      }
    }

    // Atualizar erros no hook
    Object.keys(validationErrors).forEach(field => {
      setFieldError(field, validationErrors[field]);
    });

    return {
      isValid: Object.keys(validationErrors).length === 0,
      errors: validationErrors
    };
  };

  const clearValidationErrors = () => {
    ['cliente', 'servico', 'data_agendamento', 'horario'].forEach(field => {
      clearError(field);
    });
  };

  return {
    validateAppointment,
    clearValidationErrors,
    errors
  };
}
