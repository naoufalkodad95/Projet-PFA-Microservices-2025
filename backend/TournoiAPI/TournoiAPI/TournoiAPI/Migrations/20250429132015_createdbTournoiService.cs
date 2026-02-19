using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TournoiAPI.Migrations
{
    /// <inheritdoc />
    public partial class createdbTournoiService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Equipes",
                columns: table => new
                {
                    ID_Equipe = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DateCreation = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Logo = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    NombreJoueurs = table.Column<int>(type: "int", nullable: true),
                    Capitaine = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipes", x => x.ID_Equipe);
                });

            migrationBuilder.CreateTable(
                name: "Tournois",
                columns: table => new
                {
                    ID_Tournoi = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nom = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DateDebut = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateFin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NbEquipesMax = table.Column<int>(type: "int", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Reglement = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Prix = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tournois", x => x.ID_Tournoi);
                });

            migrationBuilder.CreateTable(
                name: "Classements",
                columns: table => new
                {
                    ID_Classement = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Position = table.Column<int>(type: "int", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    DateMaj = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ID_Tournoi = table.Column<int>(type: "int", nullable: false),
                    ID_Equipe = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Classements", x => x.ID_Classement);
                    table.ForeignKey(
                        name: "FK_Classements_Equipes_ID_Equipe",
                        column: x => x.ID_Equipe,
                        principalTable: "Equipes",
                        principalColumn: "ID_Equipe",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Classements_Tournois_ID_Tournoi",
                        column: x => x.ID_Tournoi,
                        principalTable: "Tournois",
                        principalColumn: "ID_Tournoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EquipesTournois",
                columns: table => new
                {
                    ID_EquipeTournoi = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DateInscription = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Statut = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ID_Equipe = table.Column<int>(type: "int", nullable: false),
                    ID_Tournoi = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EquipesTournois", x => x.ID_EquipeTournoi);
                    table.ForeignKey(
                        name: "FK_EquipesTournois_Equipes_ID_Equipe",
                        column: x => x.ID_Equipe,
                        principalTable: "Equipes",
                        principalColumn: "ID_Equipe",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EquipesTournois_Tournois_ID_Tournoi",
                        column: x => x.ID_Tournoi,
                        principalTable: "Tournois",
                        principalColumn: "ID_Tournoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    ID_Match = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ScoreEquipe1 = table.Column<int>(type: "int", nullable: true),
                    ScoreEquipe2 = table.Column<int>(type: "int", nullable: true),
                    Statut = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    ID_Tournoi = table.Column<int>(type: "int", nullable: false),
                    ID_Equipe1 = table.Column<int>(type: "int", nullable: false),
                    ID_Equipe2 = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.ID_Match);
                    table.ForeignKey(
                        name: "FK_Matches_Equipes_ID_Equipe1",
                        column: x => x.ID_Equipe1,
                        principalTable: "Equipes",
                        principalColumn: "ID_Equipe",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Equipes_ID_Equipe2",
                        column: x => x.ID_Equipe2,
                        principalTable: "Equipes",
                        principalColumn: "ID_Equipe",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Matches_Tournois_ID_Tournoi",
                        column: x => x.ID_Tournoi,
                        principalTable: "Tournois",
                        principalColumn: "ID_Tournoi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Classements_ID_Equipe",
                table: "Classements",
                column: "ID_Equipe");

            migrationBuilder.CreateIndex(
                name: "IX_Classements_ID_Tournoi",
                table: "Classements",
                column: "ID_Tournoi");

            migrationBuilder.CreateIndex(
                name: "IX_EquipesTournois_ID_Equipe",
                table: "EquipesTournois",
                column: "ID_Equipe");

            migrationBuilder.CreateIndex(
                name: "IX_EquipesTournois_ID_Tournoi",
                table: "EquipesTournois",
                column: "ID_Tournoi");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_ID_Equipe1",
                table: "Matches",
                column: "ID_Equipe1");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_ID_Equipe2",
                table: "Matches",
                column: "ID_Equipe2");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_ID_Tournoi",
                table: "Matches",
                column: "ID_Tournoi");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Classements");

            migrationBuilder.DropTable(
                name: "EquipesTournois");

            migrationBuilder.DropTable(
                name: "Matches");

            migrationBuilder.DropTable(
                name: "Equipes");

            migrationBuilder.DropTable(
                name: "Tournois");
        }
    }
}
