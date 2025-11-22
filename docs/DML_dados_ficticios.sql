-- 1. Inserindo Usuários Fictícios (FW_User_Profile)
INSERT INTO FW_User_Profile (name, email, password)
VALUES ('João Silva', 'joao.silva@email.com', 'senha123');

INSERT INTO FW_User_Profile (name, email, password)
VALUES ('Maria Oliveira', 'maria.dev@email.com', 'segredo456');

INSERT INTO FW_User_Profile (name, email, password)
VALUES ('Carlos Tech', 'carlos.admin@email.com', 'admin789');


-- 2. Inserindo as Músicas da Imagem (FW_Music)
-- A URL segue o padrão: https://emperorofcoding.github.io/Audios-test/audios/ + nome_arquivo

INSERT INTO FW_Music (title, description, url, category)
VALUES (
           'Canto dos Pássaros',
           'Som ambiente de pássaros na floresta para relaxamento.',
           'https://emperorofcoding.github.io/Audios-test/audios/birds.mp3',
           'Natureza'
       );

INSERT INTO FW_Music (title, description, url, category)
VALUES (
           'Sons de Tigela de Metal',
           'Vibrações sonoras de tigelas tibetanas para meditação profunda.',
           'https://emperorofcoding.github.io/Audios-test/audios/bowlSoundsmetal.mp3',
           'Meditação'
       );

INSERT INTO FW_Music (title, description, url, category)
VALUES (
           'Dança do Dragão Chinês',
           'Música tradicional festiva chinesa.',
           'https://emperorofcoding.github.io/Audios-test/audios/dancaDodragaoChines.mp3',
           'Cultura'
       );

INSERT INTO FW_Music (title, description, url, category)
VALUES (
           'Chuva Binaural',
           'Som de chuva com frequências binaurais para foco e estudo.',
           'https://emperorofcoding.github.io/Audios-test/audios/rain_binaural.mp3',
           'Foco'
       );

INSERT INTO FW_Music (title, description, url, category)
VALUES (
           'Viagem de Trem',
           'Ambiente sonoro de uma viagem tranquila de trem.',
           'https://emperorofcoding.github.io/Audios-test/audios/trainTripSounds.mp3',
           'ASMR'
       );


-- 3. Inserindo Histórico de Reprodução (FW_MUSIC_HISTORY)

INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (1, 1, SYSTIMESTAMP - 2); -- Ouviu 2 dias atrás

INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (1, 4, SYSTIMESTAMP - 1); -- Ouviu 1 dia atrás

-- Maria (ID 2) ouviu "Dança do Dragão" (ID 3)
INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (2, 3, SYSTIMESTAMP - 0.5); -- Ouviu 12 horas atrás

INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (2, 5, SYSTIMESTAMP); -- Ouviu agora

INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (3, 2, SYSTIMESTAMP - 5);

INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (1, 1, SYSTIMESTAMP - 3); -- Ouviu "Birds" há 3 dias

INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (1, 4, SYSTIMESTAMP - 1); -- Ouviu "Rain Binaural" ontem

INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (1, 5, SYSTIMESTAMP - 0.04); -- Ouviu "Train Trip" há cerca de 1 hora (0.04 de um dia)


INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (2, 3, SYSTIMESTAMP - 5); -- Ouviu "Dança do Dragão" há 5 dias

INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (2, 3, SYSTIMESTAMP - 2); -- Ouviu "Dança do Dragão" de novo há 2 dias (repetiu a música)

INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (2, 5, SYSTIMESTAMP - 0.5); -- Ouviu "Train Trip" há 12 horas


INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (3, 2, SYSTIMESTAMP - 10); -- Ouviu "Bowl Sounds" semana passada

INSERT INTO FW_MUSIC_HISTORY (id_user_profile, id_music, played_at)
VALUES (3, 4, SYSTIMESTAMP); -- Está ouvindo "Rain Binaural" agora mesmo

COMMIT;


COMMIT;