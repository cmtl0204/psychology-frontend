import {AnswerModel} from '@models/psychology/answer.model';

export interface QuestionModel {
  id?: number;
  value?: string;
  type?: string;
  answers?:AnswerModel[] ;
}
