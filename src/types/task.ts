export interface UpdateTaskDto {
  title?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  priority?: string;
  assigned_to?: string;
  column_id?: string;
}
