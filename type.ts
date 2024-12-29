type Game = {
  game: string;
  image: string;
  info: string;
  danger: string;
};

export type Monster = {
  _id: {
    $oid: string;
  };
  name: string;
  type: string;
  isLarge: boolean;
  elements: string[];
  ailments: string[];
  weakness: string[];
  games: Game[];
};
