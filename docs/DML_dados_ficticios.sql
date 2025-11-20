-- ============================================================
-- 1. INSERINDO USUÁRIOS (3 registros)
-- ============================================================
INSERT INTO PERFIL_USUARIO (NOME, EMAIL, SENHA)
VALUES ('Lucas Silva', 'lucas.silva@gmail.com', 'senhaSegura123');

INSERT INTO PERFIL_USUARIO (NOME, EMAIL, SENHA)
VALUES ('Mariana Costa', 'mari.costa@outlook.com', 'gatos123');

INSERT INTO PERFIL_USUARIO (NOME, EMAIL, SENHA)
VALUES ('Pedro Alencar', 'pedro.dev@tech.com', 'root');

-- ============================================================
-- 2. INSERINDO MÚSICAS (10 registros - Variedade de categorias)
-- ============================================================
INSERT INTO MUSICAS (NOME, DESCRICAO, CATEGORIA, URL)
VALUES ('Bohemian Rhapsody', 'Clássico do Queen, álbum A Night at the Opera', 'Rock', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ');

INSERT INTO MUSICAS (NOME, DESCRICAO, CATEGORIA, URL)
VALUES ('Shape of You', 'Hit de Ed Sheeran', 'Pop', 'https://www.youtube.com/watch?v=JGwWNGJdvx8');

INSERT INTO MUSICAS (NOME, DESCRICAO, CATEGORIA, URL)
VALUES ('Garota de Ipanema', 'Tom Jobim e Vinícius de Moraes', 'Bossa Nova', 'https://www.youtube.com/watch?v=KJzBxJ8ExRk');

INSERT INTO MUSICAS (NOME, DESCRICAO, CATEGORIA, URL)
VALUES ('Hotel California', 'Eagles - Live MTV', 'Rock', 'https://www.youtube.com/watch?v=X7usA3YouKw');

INSERT INTO MUSICAS (NOME, DESCRICAO, CATEGORIA, URL)
VALUES ('Smells Like Teen Spirit', 'Nirvana - Nevermind', 'Grunge', 'https://www.youtube.com/watch?v=hTWKbfoikeg');

INSERT INTO MUSICAS (NOME, DESCRICAO, CATEGORIA, URL)
VALUES ('Billie Jean', 'Michael Jackson - Thriller', 'Pop', 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y');

INSERT INTO MUSICAS (NOME, DESCRICAO, CATEGORIA, URL)
VALUES ('Construção', 'Chico Buarque', 'MPB', 'https://www.youtube.com/watch?v=wBfVsucRe1w');

INSERT INTO MUSICAS (NOME, DESCRICAO, CATEGORIA, URL)
VALUES ('Symphony No. 9', 'Beethoven', 'Clássica', 'https://www.youtube.com/watch?v=4IqnVCc-Yqo');

INSERT INTO MUSICAS (NOME, DESCRICAO, CATEGORIA, URL)
VALUES ('Enter Sandman', 'Metallica', 'Metal', 'https://www.youtube.com/watch?v=CD-E-LDc384');

INSERT INTO MUSICAS (NOME, DESCRICAO, CATEGORIA, URL)
VALUES ('Rolling in the Deep', 'Adele - 21', 'Pop', 'https://www.youtube.com/watch?v=rYEDA3JcQqw');

-- ============================================================
-- 3. INSERINDO HISTÓRICO (20 registros)
-- ============================================================
-- Obs: SYSDATE é a data/hora atual.
-- SYSDATE - 1 significa "ontem". SYSDATE - (1/24) significa "1 hora atrás".

-- Usuário 1 (Lucas)
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (1, 1, SYSDATE - 5); -- Queen
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (1, 4, SYSDATE - 4); -- Eagles
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (1, 5, SYSDATE - 4); -- Nirvana
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (1, 9, SYSDATE - 3); -- Metallica
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (1, 1, SYSDATE - 1); -- Queen (de novo)
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (1, 5, SYSDATE - (1 / 24));
-- Nirvana (agora pouco)

-- Usuário 2 (Mariana)
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (2, 2, SYSDATE - 10); -- Ed Sheeran
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (2, 6, SYSDATE - 9); -- Michael Jackson
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (2, 10, SYSDATE - 8); -- Adele
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (2, 3, SYSDATE - 2); -- Tom Jobim
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (2, 7, SYSDATE - 1); -- Chico Buarque
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (2, 2, SYSDATE - (5 / 24)); -- Ed Sheeran (de novo)
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (2, 10, SYSDATE - (2 / 24));
-- Adele (de novo)

-- Usuário 3 (Pedro)
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (3, 8, SYSDATE - 20); -- Beethoven
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (3, 1, SYSDATE - 15); -- Queen
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (3, 3, SYSDATE - 12); -- Tom Jobim
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (3, 9, SYSDATE - 5); -- Metallica
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (3, 6, SYSDATE - 3); -- Michael Jackson
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (3, 8, SYSDATE - 1); -- Beethoven (de novo)
INSERT INTO HISTORICO_MUSICAS (ID_USUARIO, ID_MUSICA, DATA_ESCUTADA)
VALUES (3, 7, SYSDATE);
-- Chico Buarque (agora)

COMMIT;