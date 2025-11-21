-- ============================================================
-- 1. INSERINDO USUÁRIOS (3 registros)
-- ============================================================
INSERT INTO FW_USER_PROFILE (name, email, password)
VALUES ('Lucas Silva', 'lucas.silva@gmail.com', 'senhaSegura123');

INSERT INTO FW_USER_PROFILE (name, email, password)
VALUES ('Mariana Costa', 'mari.costa@outlook.com', 'gatos123');

INSERT INTO FW_USER_PROFILE (name, email, password)
VALUES ('Pedro Alencar', 'pedro.dev@tech.com', 'root');

-- ============================================================
-- 2. INSERINDO MÚSICAS (10 registros - Variedade de categorias)
-- ============================================================
INSERT INTO FW_MUSIC (title, description, category, url)
VALUES ('Bohemian Rhapsody', 'Clássico do Queen, álbum A Night at the Opera', 'Rock', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ');

INSERT INTO FW_MUSIC (title, description, category, url)
VALUES ('Shape of You', 'Hit de Ed Sheeran', 'Pop', 'https://www.youtube.com/watch?v=JGwWNGJdvx8');

INSERT INTO FW_MUSIC (title, description, category, url)
VALUES ('Garota de Ipanema', 'Tom Jobim e Vinícius de Moraes', 'Bossa Nova', 'https://www.youtube.com/watch?v=KJzBxJ8ExRk');

INSERT INTO FW_MUSIC (title, description, category, url)
VALUES ('Hotel California', 'Eagles - Live MTV', 'Rock', 'https://www.youtube.com/watch?v=X7usA3YouKw');

INSERT INTO FW_MUSIC (title, description, category, url)
VALUES ('Smells Like Teen Spirit', 'Nirvana - Nevermind', 'Grunge', 'https://www.youtube.com/watch?v=hTWKbfoikeg');

INSERT INTO FW_MUSIC (title, description, category, url)
VALUES ('Billie Jean', 'Michael Jackson - Thriller', 'Pop', 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y');

INSERT INTO FW_MUSIC (title, description, category, url)
VALUES ('Construção', 'Chico Buarque', 'MPB', 'https://www.youtube.com/watch?v=wBfVsucRe1w');

INSERT INTO FW_MUSIC (title, description, category, url)
VALUES ('Symphony No. 9', 'Beethoven', 'Clássica', 'https://www.youtube.com/watch?v=4IqnVCc-Yqo');

INSERT INTO FW_MUSIC (title, description, category, url)
VALUES ('Enter Sandman', 'Metallica', 'Metal', 'https://www.youtube.com/watch?v=CD-E-LDc384');

INSERT INTO FW_MUSIC (title, description, category, url)
VALUES ('Rolling in the Deep', 'Adele - 21', 'Pop', 'https://www.youtube.com/watch?v=rYEDA3JcQqw');

-- ============================================================
-- 3. INSERINDO HISTÓRICO (20 registros)
-- ============================================================
-- Obs: SYSDATE é a data/hora atual.
-- SYSDATE - 1 significa "ontem". SYSDATE - (1/24) significa "1 hora atrás".

-- Usuário 1 (Lucas)
INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (1, 1, SYSTIMESTAMP - INTERVAL '5' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (1, 4, SYSTIMESTAMP - INTERVAL '4' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (1, 5, SYSTIMESTAMP - INTERVAL '4' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (1, 9, SYSTIMESTAMP - INTERVAL '3' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (1, 1, SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (1, 5, SYSTIMESTAMP - INTERVAL '1' HOUR);
-- Nirvana (agora pouco)

-- Usuário 2 (Mariana)
INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (2, 2, SYSTIMESTAMP - INTERVAL '10' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (2, 6, SYSTIMESTAMP - INTERVAL '9' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (2, 10, SYSTIMESTAMP - INTERVAL '8' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (2, 3, SYSTIMESTAMP - INTERVAL '2' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (2, 7, SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (2, 2, SYSTIMESTAMP - INTERVAL '5' HOUR);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (2, 10, SYSTIMESTAMP - INTERVAL '2' HOUR);
-- Adele (de novo)

-- Usuário 3 (Pedro)
INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (3, 8, SYSTIMESTAMP - INTERVAL '20' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (3, 1, SYSTIMESTAMP - INTERVAL '15' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (3, 3, SYSTIMESTAMP - INTERVAL '12' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (3, 9, SYSTIMESTAMP - INTERVAL '5' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (3, 6, SYSTIMESTAMP - INTERVAL '3' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (3, 8, SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO FW_HISTORICO_MUSICAS (id_user_profile, id_music, played_at)
VALUES (3, 7, SYSTIMESTAMP);
-- Chico Buarque (agora)

COMMIT;