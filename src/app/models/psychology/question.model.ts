import {AnswerModel} from '@models/psychology/answer.model';

export interface QuestionModel {
  id?: number;
  value?: string;
  type?: string;
  order?: number;
  answers?:AnswerModel[] ;
}
