import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | null | undefined, format: 'date' | 'weekday' | 'time' = 'date'): string {
    if (!value) {
      return format === 'weekday' ? 'No especificado' : format === 'time' ? 'No especificada' : 'Sin fecha';
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return format === 'weekday' ? 'No especificado' : format === 'time' ? 'No especificada' : 'Sin fecha';
    }
    switch (format) {
      case 'weekday':
        return date.toLocaleDateString('es-ES', { weekday: 'long' });
      case 'time':
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      case 'date':
      default:
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
    }
  }
}