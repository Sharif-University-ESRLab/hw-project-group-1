import { Video } from "expo-av";
import VideoPlayer from "expo-video-player";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  get_alarm_status,
  get_pictures,
  get_record_status,
  get_video,
} from "./camera/requests";

const { width } = Dimensions.get("window");

const IMAGES = [
  {
    name: "pic1",
    image:
      "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IECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAg8AAAA//9/sUVdAAAanklEQVTt2EERACAMA0FwjwK04A5msHFbB9n0lbnXucMRIECAAAECBAgQIECAAAECBEIC0yASaltUAgQIECBAgAABAgQIECBA4AsYRDwCAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECBhE/AABAgQIECBAgAABAgQIECCQEzCI5CoXmAABAgQIECBAgAABAgQIEDCI+AECBAgQIECAAAECBAgQIEAgJ2AQyVUuMAECBAgQIECAAAECBAgQIGAQ8QMECBAgQIAAAQIECBAgQIBATsAgkqtcYAIECBAgQIAAAQIECBAgQMAg4gcIECBAgAABAgQIECBAgACBnIBBJFe5wAQIECBAgAABAgQIECBAgIBBxA8QIECAAAECBAgQIECAAAECOQGDSK5ygQkQIECAAAECBAgQIECAAAGDiB8gQIAAAQIECBAgQIAAAQIEcgIGkVzlAhMgQIAAAQIECBAgQIAAAQIGET9AgAABAgQIECBAgAABAgQI5AQMIrnKBSZAgAABAgQIECBAgAABAgQMIn6AAAECBAgQIECAAAECBAgQyAkYRHKVC0yAAAECBAgQIECAAAECBAgYRPwAAQIECBAgQIAAAQIECBAgkBMwiOQqF5gAAQIECBAgQIAAAQIECBAwiPgBAgQIECBAgAABAgQIECBAICdgEMlVLjABAgQIECBAgAABAgQIECBgEPEDBAgQIECAAAECBAgQIECAQE7AIJKrXGACBAgQIECAAAECBAgQIEDAIOIHCBAgQIAAAQIECBAgQIAAgZyAQSRXucAECBAgQIAAAQIECBAgQICAQcQPECBAgAABAgQIECBAgAABAjkBg0iucoEJECBAgAABAgQIECBAgAABg4gfIECAAAECBAgQIECAAAECBHICBpFc5QITIECAAAECBAgQIECAAAECBhE/QIAAAQIECBAgQIAAAQIECOQEDCK5ygUmQIAAAQIECBAgQIAAAQIEDCJ+gAABAgQIECBAgAABAgQIEMgJGERylQtMgAABAgQIECBAgAABAgQIGET8AAECBAgQIECAAAECBAgQIJATMIjkKheYAAECBAgQIECAAAECBAgQMIj4AQIECBAgQIAAAQIECBAgQCAnYBDJVS4wAQIECBAgQIAAAQIECBAgYBDxAwQIECBAgAABAgQIECBAgEBOwCCSq1xgAgQIECBAgAABAgQIECBAwCDiBwgQIECAAAECBAgQIECAAIGcgEEkV7nABAgQIECAAAECBAgQIECAgEHEDxAgQIAAAQIECBAgQIAAAQI5AYNIrnKBCRAgQIAAAQIECBAgQIAAAYOIHyBAgAABAgQIECBAgAABAgRyAgaRXOUCEyBAgAABAgQIECBAgAABAgYRP0CAAAECBAgQIECAAAECBAjkBAwiucoFJkCAAAECBAgQIECAAAECBAwifoAAAQIECBAgQIAAAQIECBDICRhEcpULTIAAAQIECBAgQIAAAQIECDw3SSLC6KPuGwAAAABJRU5ErkJggg==",
  },
];

export default function Camera() {
  const [isRecording, setIsRecording] = useState(true);
  const [alarm, setAlarm] = useState(false);
  const [images, setImages] = useState(IMAGES);
  const [indexSelected, setIndexSelected] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState(
    "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
  );

  const onSelect = (indexSelected: number) => {
    setIndexSelected(indexSelected);
  };

  useEffect(() => {
    // initializeRecording();
    // initializeAlarm();
    // getImages();
  }, []);

  const initializeRecording = () => {
    get_record_status()
      .then((response) => response.text())
      .then((status) => {
        if (status === "recording") {
          setIsRecording(true);
        } else {
          setIsRecording(false);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const initializeAlarm = () => {
    get_alarm_status()
      .then((response) => response.text())
      .then((status) => {
        if (status === "on") {
          setAlarm(true);
        } else {
          setAlarm(false);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleAlarm = (value: boolean) => {
    // if (value === true) {
    //   set_alarm_on()
    //     .then((status) => {})
    //     .catch((error) => {
    //       alert(error);
    //       setAlarm(!value);
    //     });
    // } else {
    //   set_alarm_off()
    //     .then((status) => {})
    //     .catch((error) => {
    //       alert(error);
    //       setAlarm(!value);
    //     });
    // }
    setAlarm(value);
  };

  const handleSwitch = (value: boolean) => {
    // if (value === true) {
    //   start_recording()
    //     .then((status) => {})
    //     .catch((error) => {
    //       alert(error);
    //       setIsRecording(!value);
    //     });
    // } else {
    //   stop_recording()
    //     .then((status) => {})
    //     .catch((error) => {
    //       alert(error);
    //       setIsRecording(!value);
    //     });
    // }
    setIsRecording(value);
  };

  const getImages = () => {
    get_pictures()
      .then((response) => response.json())
      .then((pictures) => {
        setImages(pictures.arr);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const getVideo = async () => {
    setShowVideo(true);
    const name = images[indexSelected].name.replace(".jpg", ".mp4");
    get_video(name)
      .then((response) => response.text())
      .then((value) => {
        setVideoUrl(value);
        setShowVideo(true);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const onVideoError = () => {
    setShowVideo(false);
    alert("There has been a problem with the video, Please try again.");
  };

  return (
    <>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          paddingTop: 25,
          backgroundColor: "white",
          shadowColor: "#ccc",
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 10,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image
          resizeMode="contain"
          source={require("./assets/logo.png")}
          style={{ height: 40 }}
        ></Image>
        <Text
          style={{
            color: "black",
            fontSize: 30,
            fontWeight: "bold",
          }}
        >
          Camera
        </Text>
      </View>
      <View style={{ ...styles.container, marginTop: 150 }}>
        <View
          style={{
            ...styles.flex,
            ...styles.spaceBetween,
            alignItems: "flex-start",
            flex: 1 / 5,
          }}
        >
          <Text style={{ ...styles.text, ...styles.mr }}>Camera recording</Text>
          <Switch
            trackColor={{ true: "#8770AE" }}
            onValueChange={handleSwitch}
            value={isRecording}
          />
        </View>
        <View
          style={{
            ...styles.flex,
            ...styles.spaceBetween,
            alignItems: "flex-start",
            flex: 1 / 5,
          }}
        >
          <Text style={{ ...styles.text, ...styles.mr }}>
            Alarm Notification
          </Text>
          <Switch
            trackColor={{ true: "#8770AE" }}
            onValueChange={handleAlarm}
            value={alarm}
          />
        </View>
        <View
          style={{
            flex: 1 / 2,
            alignItems: "center",
          }}
        >
          <Text
            style={{ ...styles.text, ...styles.mb, alignSelf: "flex-start" }}
          >
            Gallery
          </Text>
          <Carousel
            layout="default"
            data={images}
            sliderWidth={width - 60}
            itemWidth={width - 60}
            onSnapToItem={(index) => onSelect(index)}
            renderItem={({ item, index }) => (
              <Image
                key={index}
                resizeMode="contain"
                source={{
                  uri: `data:image/jpg;base64,${item.image}`,
                }}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          />
          <Pagination
            inactiveDotColor="gray"
            dotColor={"orange"}
            activeDotIndex={indexSelected}
            dotsLength={images.length}
            animatedDuration={150}
            inactiveDotScale={1}
          />
          <Button
            color={"#8770AE"}
            title={"Play Video"}
            onPress={getVideo}
          ></Button>
        </View>
      </View>
      <Modal visible={showVideo}>
        <View>
          <VideoPlayer
            videoProps={{
              shouldPlay: true,
              resizeMode: Video.RESIZE_MODE_CONTAIN,
              source: {
                uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
              },
            }}
            errorCallback={onVideoError}
            fullscreen={{ visible: false }}
            autoHidePlayer={false}
            header={
              <TouchableOpacity onPress={() => setShowVideo(false)}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 30,
                    paddingLeft: 30,
                    paddingTop: 40,
                  }}
                >
                  X
                </Text>
              </TouchableOpacity>
            }
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 60,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: "#fff",
    height: "100%",
    flex: 1,
    flexDirection: "column",
  },
  flex: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pl: {
    paddingLeft: 16,
  },
  pr: {
    paddingRight: 16,
  },
  mr: {
    marginRight: 16,
  },
  mb: {
    marginBottom: 20,
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
