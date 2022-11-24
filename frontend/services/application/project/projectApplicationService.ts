import { Page } from '~/domain/models/page'
import { Project } from '~/domain/models/project/project'
import { ProjectRepository, SearchQuery } from '~/domain/models/project/projectRepository'

type Options = {
  name: string
  description: string
  guideline: string
  projectType: string
  enableRandomOrder: boolean
  enableSharingMode: boolean
  exclusiveCategories: boolean
  tags: string[]
  allowOverlappingSpans: boolean
  enableGraphemeMode: boolean
  useRelation: boolean
}

export interface SearchQueryData {
  limit: string
  offset: string
  q?: string
  sortBy?: string
  sortDesc?: string
}

export class ProjectApplicationService {
  constructor(private readonly repository: ProjectRepository) {}

  public async list(q: SearchQueryData): Promise<Page<Project>> {
    try {
      const query = new SearchQuery(q.limit, q.offset, q.q, q.sortBy, q.sortDesc)
      return await this.repository.list(query)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async findById(id: string): Promise<Project> {
    return await this.repository.findById(id)
  }

  public async create({
    name,
    description,
    projectType,
    enableRandomOrder,
    enableSharingMode,
    exclusiveCategories,
    allowOverlappingSpans,
    enableGraphemeMode,
    useRelation,
    tags,
    guideline = ''
  }: Options): Promise<Project> {
    const project = Project.create(
      0,
      name,
      description,
      guideline,
      projectType,
      enableRandomOrder,
      enableSharingMode,
      exclusiveCategories,
      allowOverlappingSpans,
      enableGraphemeMode,
      useRelation,
      tags.map((tag) => ({ text: tag }))
    )
    try {
      return await this.repository.create(project)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async update(
    projectId: number,
    {
      name,
      description,
      projectType,
      enableRandomOrder,
      enableSharingMode,
      exclusiveCategories,
      allowOverlappingSpans,
      enableGraphemeMode,
      useRelation,
      guideline = ''
    }: Options
  ): Promise<void> {
    const project = Project.create(
      projectId,
      name,
      description,
      guideline,
      projectType,
      enableRandomOrder,
      enableSharingMode,
      exclusiveCategories,
      allowOverlappingSpans,
      enableGraphemeMode,
      useRelation,
      []
    )

    try {
      // item.tags = [] // TODO: somewhat hacky
      await this.repository.update(project)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public bulkDelete(projects: Project[]): Promise<void> {
    const ids = projects.map((project) => project.id)
    return this.repository.bulkDelete(ids)
  }
}
