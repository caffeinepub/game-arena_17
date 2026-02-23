import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  let highScores = List.empty<Int>();
  let gameplayArray = List.empty<Bool>();

  public shared ({ caller }) func submitScore(score : Nat) : async () {
    highScores.add(score);
    highScores.add(score * 2);
  };

  public query ({ caller }) func getHighScores() : async [Int] {
    highScores.filter(func(score) { score >= 1000 }).toArray();
  };

  public shared ({ caller }) func play() : async () {
    gameplayArray.add(true);
    gameplayArray.add(false);
    Runtime.trap("Game Over. Try again and beat your high score!");
  };
};
