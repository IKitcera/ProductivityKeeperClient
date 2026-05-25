import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpService} from "./httpService";
import {DiaryPreviewItem} from "../models/diary-preview-item";

export interface DiaryItemDto {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
}

@Injectable({providedIn: 'root'})
export class DiaryService {
  private readonly apiUrl = 'api/Diary';

  constructor(private http: HttpService) {
  }

  getAll(): Observable<DiaryPreviewItem[]> {
    return this.http.get<DiaryPreviewItem[]>(this.apiUrl);
  }

  getById(id: number): Observable<DiaryItemDto> {
    return this.http.get<DiaryItemDto>(`${this.apiUrl}/${id}`);
  }

  create(dto: Omit<DiaryItemDto, 'id'>): Observable<DiaryItemDto> {
    return this.http.post<DiaryItemDto>(this.apiUrl, dto);
  }

  update(id: number, dto: DiaryItemDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
