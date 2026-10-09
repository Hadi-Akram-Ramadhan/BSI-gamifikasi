"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { WS_BASE } from "./api";
import { sound } from "./audio";
import {
  Room,
  Question,
  OptionKey,
  TeamType,
  AnswerResultPayload,
  GameOverPayload,
} from "./types";

interface UseGameSocketProps {
  roomCode: string;
  playerId?: string;
  playerName?: string;
  avatar?: string;
  team?: TeamType;
  isHost?: boolean;
}

export function useGameSocket({
  roomCode,
  playerId,
  playerName,
  avatar = "1",
  team = "none",
  isHost = false,
}: UseGameSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [lastResult, setLastResult] = useState<AnswerResultPayload | null>(null);
  const [gameOverData, setGameOverData] = useState<GameOverPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendMessage = useCallback((type: string, payload: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type,
          room_code: roomCode,
          payload,
        })
      );
    }
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode) return;

    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setErrorMessage(null);

      // Otomatis join room setelah koneksi terbuka
      sendMessage("join_room", {
        player_id: playerId || `guest-${Math.random().toString(36).substring(2, 8)}`,
        name: playerName || (isHost ? "Host Layar TV" : "Siswa"),
        avatar: avatar,
        team: team,
        is_host: isHost,
      });
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case "room_state": {
            const updatedRoom = msg.payload as Room;
            setRoom(updatedRoom);
            if (updatedRoom.state === "in_progress" && updatedRoom.questions) {
              setCurrentQuestion(updatedRoom.questions[updatedRoom.current_question_idx]);
              setQuestionIndex(updatedRoom.current_question_idx);
              setTotalQuestions(updatedRoom.questions.length);
            }
            break;
          }
          case "game_started":
          case "question_change": {
            const p = msg.payload as {
              question: Question;
              question_index: number;
              total_questions: number;
            };
            setCurrentQuestion(p.question);
            setQuestionIndex(p.question_index);
            setTotalQuestions(p.total_questions);
            setLastResult(null);
            sound.playTimerTick();
            break;
          }
          case "answer_result": {
            const res = msg.payload as AnswerResultPayload;
            setLastResult(res);
            if (res.is_correct) {
              sound.playCorrectChime();
            } else {
              sound.playWrongSoft();
            }
            break;
          }
          case "game_over": {
            const over = msg.payload as GameOverPayload;
            setGameOverData(over);
            sound.playVictoryFanfare();
            break;
          }
          case "error": {
            const err = msg.payload as { message: string };
            setErrorMessage(err.message);
            break;
          }
        }
      } catch (err) {
        console.error("Gagal parse event WebSocket:", err);
      }
    };

    ws.onerror = () => {
      setErrorMessage("Koneksi ke server terputus");
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [roomCode, playerId, playerName, avatar, team, isHost, sendMessage]);

  const startGame = useCallback(() => {
    sendMessage("start_game", {});
  }, [sendMessage]);

  const submitAnswer = useCallback(
    (option: OptionKey) => {
      sound.playBuzzerClick();
      sendMessage("submit_answer", {
        player_id: playerId,
        option,
      });
    },
    [playerId, sendMessage]
  );

  const nextQuestion = useCallback(() => {
    sendMessage("next_question", {});
  }, [sendMessage]);

  return {
    isConnected,
    room,
    currentQuestion,
    questionIndex,
    totalQuestions,
    lastResult,
    gameOverData,
    errorMessage,
    startGame,
    submitAnswer,
    nextQuestion,
  };
}
