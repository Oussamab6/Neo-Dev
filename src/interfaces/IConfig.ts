import { ReactElement } from 'react';

import { IBaseMessage, IMessage } from './IMessages';
import IWidget from './IWidget';

interface IConfig {
  botName?: string;
  avatarIcon?: IAvatarStyles;
  initialMessages?: IMessage[];
  state?: any;
  customComponents?: ICustomComponents;
  customStyles?: ICustomStyles;
  customMessages?: ICustomMessage;
  widgets?: IWidget[];
}

export interface ICustomComponents {
  header?: (props?: any) => ReactElement;
  botAvatar?: (props?: any) => ReactElement;
  botChatMessage?: (props?: any) => ReactElement;
  userAvatar?: (props?: any) => ReactElement;
  userChatMessage?: (props?: any) => ReactElement;
}

export interface ICustomMessage {
  [index: string]: (props: any) => ReactElement;
}

export interface ICustomStyles {
  botMessageBox?: IMessageColor;
  chatButton?: IBackgroundColor;
  botcolor?: IBackgroundColor;
  headercolor?: IHeaderColor;
}
export interface IAvatarStyles {
  avatarIconn?: IAvatarIcon;
}

interface IBackgroundColor {
  backgroundColor: string;
}
interface IMessageColor {
  backgroundColor: string;
  color: string;
}
interface IAvatarIcon {
  backgroundColor: string;
  textt: string;
}
interface IHeaderColor {
  backgroundColor: string;
  backgroundImage: string;
  color: string;
}

export default IConfig;
