import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WelcomePage } from "../pages/WelcomePage";
import { MainMenuPage } from "../pages/MainMenuPage";
import { CreateRoomPage } from "../pages/CreateRoomPage";
import { JoinRoomPage } from "../pages/JoinRoomPage";
import { LobbyPage } from "../pages/LobbyPage";
import { GamePage } from "../pages/GamePage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/menu" element={<MainMenuPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route path="/join" element={<JoinRoomPage />} />
        <Route path="/room/:code" element={<LobbyPage />} />
        <Route path="/game/:code" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

