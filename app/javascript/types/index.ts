export interface AppProps {
    // Define any props your App component might receive from Rails
}

export interface MainLayoutProps {
    children: React.ReactNode;
}

export interface ActionCableMessage {
    message: string;
    [key: string]: any;
}
