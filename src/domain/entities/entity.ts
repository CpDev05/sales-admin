export abstract class Entity<TProps> {
  protected readonly _id: string;
  protected props: TProps;

  protected constructor(id: string, props: TProps) {
    this._id = id;
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  public equals(entity?: Entity<TProps>): boolean {
    if (!entity) return false;

    if (this === entity) return true;

    return this._id === entity.id;
  }
}
