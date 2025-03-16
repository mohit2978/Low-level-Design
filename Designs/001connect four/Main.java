
import java.util.*;

enum GridPosition {
    EMPTY, YELLOW, RED
}

class Grid {
    private int rows;
    private int columns;
    private int[][] grid;

    public Grid(int rows, int columns) {
        this.rows = rows;
        this.columns = columns;
        initGrid();
    }

    public void initGrid() {
        this.grid = new int[rows][columns];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                grid[i][j] = GridPosition.EMPTY.ordinal();
            }
        }
    }

    public int[][] getGrid() {
        return this.grid;
    }

    public int getColumnCount() {
        return this.columns;
    }

    public int placePiece(int column, GridPosition piece) {
        if (column < 0 || column >= this.columns) {
            throw new Error("Invalid column");
        }
        if (piece == GridPosition.EMPTY) {
            throw new Error("Invalid piece");
        }
        // Place piece in the lowest empty row
        for (int row = this.rows - 1; row >= 0; row--) {
            if (this.grid[row][column] == GridPosition.EMPTY.ordinal()) {
                this.grid[row][column] = piece.ordinal();
                return row;
            }
        }
        return -1;
    }

    public boolean checkWin(int connectN, int row, int col, GridPosition piece) {
        // Check horizontal
        int count = 0;
        for (int c = 0; c < this.columns; c++) {
            if (this.grid[row][c] == piece.ordinal()) {
                count++;
            } else {
                count = 0;
            }
            if (count == connectN) {
                return true;
            }
        }

        // Check vertical
        count = 0;
        for (int r = 0; r < this.rows; r++) {
            if (this.grid[r][col] == piece.ordinal()) {
                count++;
            } else {
                count = 0;
            }
            if (count == connectN) {
                return true;
            }
        }

        // Check diagonal
        count = 0;
        for (int r = 0; r < this.rows; r++) {
            int c = row + col - r; // row + col = r + c, for a diagonal
            if (c >= 0 && c < this.columns && this.grid[r][c] == piece.ordinal()) {
                count++;
            } else {
                count = 0;
            }
            if (count == connectN) {
                return true;
            }
        }

        // Check anti-diagonal
        count = 0;
        for (int r = 0; r < this.rows; r++) {
            int c = col - row + r; // row - col = r - c, for an anti-diagonal
            if (c >= 0 && c < this.columns && this.grid[r][c] == piece.ordinal()) {
                count++;
            } else {
                count = 0;
            }
            if (count == connectN) {
                return true;
            }
        }
        return false;
    }
}

class Player {
    private String name;
    private GridPosition piece;

    public Player(String name, GridPosition piece) {
        this.name = name;
        this.piece = piece;
    }

    public String getName() {
        return this.name;
    }

    public GridPosition getPieceColor() {
        return this.piece;
    }
}

class Game {
    static Scanner input = new Scanner(System.in);
    private Grid grid;
    private int connectN;
    private Player[] players;
    private Map<String, Integer> score;
    private int targetScore;

    public Game(Grid grid, int connectN, int targetScore) {
        this.grid = grid;
        this.connectN = connectN;
        this.targetScore = targetScore;

        this.players = new Player[] {
            new Player("Player 1", GridPosition.YELLOW),
            new Player("Player 2", GridPosition.RED)
        };

        this.score = new HashMap<>();
        for (Player player : this.players) {
            this.score.put(player.getName(), 0);
        }
    }

    private void printBoard() {
        System.out.println("Board:");
        int[][] grid = this.grid.getGrid();
        for (int i = 0; i < grid.length; i++) {
            String row = "";
            for (int piece : grid[i]) {
                if (piece == GridPosition.EMPTY.ordinal()) {
                    row += "0 ";
                } else if (piece == GridPosition.YELLOW.ordinal()) {
                    row += "Y ";
                } else if (piece == GridPosition.RED.ordinal()) {
                    row += "R ";
                }
            }
            System.out.println(row);
        }
        System.out.println();
    }

    private int[] playMove(Player player) {
        printBoard();
        System.out.println(player.getName() + "'s turn");
        int colCnt = this.grid.getColumnCount();
        
        System.out.print("Enter column between 0 and " + (colCnt - 1) + " to add piece: ");
        int moveColumn = input.nextInt();
        int moveRow = this.grid.placePiece(moveColumn, player.getPieceColor());
        return new int[] { moveRow, moveColumn };
    }

    private Player playRound() {
        while (true) {
            for (Player player : this.players) {
                int[] pos = playMove(player);
                int row = pos[0];
                int col = pos[1];
                GridPosition pieceColor = player.getPieceColor();
                if (this.grid.checkWin(this.connectN, row, col, pieceColor)) {
                    this.score.put(player.getName(), this.score.get(player.getName()) + 1);
                    return player;
                }
            }
        }
    }

    public void play() {
        int maxScore = 0;
        Player winner = null;
        while (maxScore < this.targetScore) {
            winner = playRound();
            System.out.println(winner.getName() + " won the round");
            maxScore = Math.max(this.score.get(winner.getName()), maxScore);

            this.grid.initGrid(); // reset grid
        } 
        System.out.println(winner.getName() + " won the game");
    }
}

public class Main{
    public static void main(String[] args) {
        Grid grid = new Grid(6, 7);
        Game game = new Game(grid, 4, 10);
        game.play();
    }
}
