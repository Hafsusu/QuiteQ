export type RootStackParamList = {
  Home: undefined;
  Modes: undefined;
  ModeDetail: { modeId: string };
  Statistics: undefined;
  Settings: undefined;
  Activity: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}